import { IInterviewEngineDependencies, IInterviewSessionState, InterviewState } from './InterviewEngineTypes';

export class InterviewEngine {
  constructor(private readonly deps: IInterviewEngineDependencies) {}

  public async startInterview(candidateId: string, roleId: string): Promise<string> {
    try {
      this.deps.monitoring.incrementCounter('interview_start_attempt', 1, { roleId });
      
      const session = await this.deps.sessionManager.createSession(candidateId, roleId);
      const sessionId = session.id;
      const interviewId = session.interviewId;

      const curriculum = await this.deps.curriculumLoader.loadCurriculum(roleId);

      // Clear history first (before writing state, so there's no wipe-after-write race)
      await this.deps.contextManager.initializeContext(sessionId);

      const state: IInterviewSessionState = {
        sessionId,
        interviewId,
        candidateId,
        roleId,
        status: InterviewState.PROCESSING,
        currentTopic: null,
        currentQuestion: null,
        expectedConcepts: [],
        isFollowUp: false,
        difficulty: 'medium',
        curriculum,
        scoreAccumulator: 0,
        questionCount: 0,
        followUpCount: 0,
        questionsOnCurrentTopic: 0,
        startedAt: Date.now(),
      };

      await this.deps.stateStore.setSessionState(sessionId, state);

      await this.progressInterview(sessionId);
      
      return sessionId;
    } catch (error: any) {
      this.deps.errorHandler.logError(error);
      throw error;
    }
  }

  /**
   * Processes a candidate's answer end-to-end and returns the outcome
   * synchronously within the same call. This prevents the race condition
   * where the HTTP route reads Redis state before the LLM pipeline has
   * written the next question.
   */
  public async submitAnswer(
    sessionId: string,
    answer: string,
    opts?: { timeTakenMs?: number; confidenceScore?: number }
  ): Promise<{ nextQuestion?: string; completed: boolean; reasoning?: string; difficulty?: string; timedOut?: boolean; score?: number; topic?: string }> {
    const state = await this.deps.stateStore.getSessionState(sessionId);
    if (!state) throw new Error('Session not found or inactive');
    if (state.status !== InterviewState.WAITING_FOR_ANSWER) throw new Error('Not currently waiting for an answer');

    state.status = InterviewState.PROCESSING;
    await this.deps.stateStore.setSessionState(sessionId, state);
    await this.deps.contextManager.addToHistory(sessionId, 'candidate', answer);

    // ── Feature 4: Backend-Enforced 120s Countdown Timer ──────────────────
    const QUESTION_TIME_LIMIT_MS = 120_000; // 2 minutes hard limit
    const serverTimeTakenMs = state.questionStartTime
      ? Date.now() - state.questionStartTime
      : undefined;
    const timeTakenMs = opts?.timeTakenMs ?? serverTimeTakenMs;

    // If the server clock shows time exceeded the limit, treat as a timed-out answer
    const timedOut = serverTimeTakenMs !== undefined && serverTimeTakenMs > QUESTION_TIME_LIMIT_MS;
    if (timedOut) {
      // Broadcast timeout event so the frontend can show it
      this.deps.websocketManager.sendMessageToSession(sessionId, 'QUESTION_TIMEOUT', {
        message: 'Time limit exceeded. Moving to next question.',
        timeTakenMs: serverTimeTakenMs
      });
    }

    try {
      let processedAnswer = answer;
      if (this.deps.promptSecurity) {
        processedAnswer = this.deps.promptSecurity.analyzeAndProcess(answer, sessionId);
      }

      // Skip validation/analysis for timed-out answers — treat as low-score blank
      let analysis: any;
      let score: number;

      if (timedOut) {
        analysis = { technical_accuracy: 0, confidence: 0, candidateAnswer: answer };
        score = 0;
      } else {
        const validation = await this.deps.answerValidator.validate(processedAnswer);
        if (!validation.isValid) {
          this.deps.websocketManager.sendMessageToSession(sessionId, 'VALIDATION_ERROR', { message: validation.error });
          state.status = InterviewState.WAITING_FOR_ANSWER;
          await this.deps.stateStore.setSessionState(sessionId, state);
          // Return the same question so the frontend can show an error without wiping the chat
          return { completed: false, nextQuestion: state.currentQuestion ?? undefined };
        }
        analysis = await this.deps.candidateAnalyzer.analyze(processedAnswer, state.expectedConcepts, state.currentQuestion ?? undefined);
        score = await this.deps.scoringEngine.score(analysis);
      }

      state.scoreAccumulator += score;
      state.questionCount++;
      state.questionsOnCurrentTopic = (state.questionsOnCurrentTopic ?? 0) + 1;

      // ── Log question+answer+score for the final report ────────────────────
      if ((this.deps as any).reportGenerator?.recordQuestion) {
        (this.deps as any).reportGenerator.recordQuestion(
          state.currentTopic ?? 'General',
          state.currentQuestion ?? '',
          answer,
          score,
          analysis,
          sessionId  // pass sessionId so per-session logs don't bleed into each other
        );
      }

      // ── Feature 5: Follow-Up Cap (max 1 per topic) ────────────────────────
      // Capped at 1 follow-up per topic so the interview advances through more topics.
      const rawNeedsFollowUp = !timedOut && this.deps.followUpGenerator.needsFollowUp(analysis);
      const needsFollowUp = rawNeedsFollowUp && (state.followUpCount ?? 0) < 1;

      // ── Topic pacing: advance after 2 questions on the same topic ─────────
      // 2 questions per topic × 4 topics = 8 main questions + up to 4 follow-ups = ~12 total.
      const QUESTIONS_PER_TOPIC = 2;
      const shouldAdvanceTopic = !needsFollowUp &&
        (state.questionsOnCurrentTopic >= QUESTIONS_PER_TOPIC || timedOut);

      if (state.currentTopic) {
        await this.deps.topicPerformanceTracker.recordPerformance(sessionId, state.currentTopic, {
          score,
          technicalAccuracy: analysis.technical_accuracy,
          confidence: analysis.confidence ?? opts?.confidenceScore,
          followUp: needsFollowUp,
          timeTakenMs,
        });
      }
      
      if (needsFollowUp) {
        state.isFollowUp = true;
        state.followUpCount = (state.followUpCount ?? 0) + 1;
        const followUp = await this.deps.followUpGenerator.generateFollowUp(analysis, state.currentQuestion!);
        // askQuestion persists the new question to Redis and broadcasts via WS
        await this.askQuestion(state, followUp, state.expectedConcepts);
        // Re-read the settled state to return the persisted question text
        const settled = await this.deps.stateStore.getSessionState(sessionId);
        return { completed: false, nextQuestion: settled?.currentQuestion ?? followUp, timedOut, score, topic: state.currentTopic ?? undefined };
      } else {
        state.isFollowUp = false;
        state.followUpCount = 0; // Reset counter when moving to a new topic

        if (shouldAdvanceTopic) {
          // Mark current topic as completed in topic-state before progressing
          const ts = await (this.deps.stateStore as any).getTopicState?.(sessionId);
          if (ts && state.currentTopic) {
            ts.completedTopics = [...(ts.completedTopics ?? []), state.currentTopic];
            await (this.deps.stateStore as any).setTopicState?.(sessionId, ts);
          }
          state.questionsOnCurrentTopic = 0; // Reset for new topic
        }

        await this.deps.stateStore.setSessionState(sessionId, state);
        // progressInterview now awaits the full pipeline and returns whether the interview ended
        const completed = await this.progressInterview(sessionId);
        if (completed) {
          return { completed: true, score, topic: state.currentTopic ?? undefined };
        }
        // Read the state after progressInterview has written the next question to Redis
        const settled = await this.deps.stateStore.getSessionState(sessionId);
        return { completed: false, nextQuestion: settled?.currentQuestion ?? undefined, timedOut, score, topic: state.currentTopic ?? undefined };
      }
    } catch (error: any) {
      state.status = InterviewState.ERROR;
      await this.deps.stateStore.setSessionState(sessionId, state);
      this.deps.errorHandler.logError(error, sessionId);
      this.deps.websocketManager.sendMessageToSession(sessionId, 'SYSTEM_ERROR', { message: 'An internal error occurred.' });
      throw error;
    }
  }

  private async progressInterview(sessionId: string): Promise<boolean> {
    const state = await this.deps.stateStore.getSessionState(sessionId);
    if (!state) return true;

    // ── Minimum topic coverage guardrail ──────────────────────────────────────
    // The interview must cover at least MIN_TOPICS distinct topics.
    // If the global question count has reached MAX_QUESTIONS but fewer than MIN_TOPICS
    // topics have been completed, we continue asking rather than ending early.
    const MIN_TOPICS = 4;
    const MAX_QUESTIONS = 20;

    try {
      // ── Topic pacing: only fetch a new topic when questionsOnCurrentTopic was reset to 0
      // (meaning the caller already marked the old topic complete and reset the counter).
      // If we still have questions to ask on the current topic, stay on it.
      let topicId: string | null = state.currentTopic;
      const shouldPickNewTopic = (state.questionsOnCurrentTopic ?? 0) === 0;

      if (shouldPickNewTopic) {
        topicId = await this.deps.topicSelector.getNextTopic(sessionId, state.curriculum);
        if (!topicId) {
          // All curriculum topics exhausted — check minimum topic coverage
          const topicState = await (this.deps.stateStore as any).getTopicState?.(sessionId);
          const coveredCount = topicState?.completedTopics?.length ?? 0;
          if (coveredCount < MIN_TOPICS) {
            // Not enough topics covered but curriculum ran out — end anyway
            console.warn(`[InterviewEngine] Interview ended with only ${coveredCount}/${MIN_TOPICS} required topics (curriculum exhausted).`);
          }
          await this.completeInterview(sessionId);
          return true;
        }
        state.currentTopic = topicId;
      }

      if (!topicId) {
        await this.completeInterview(sessionId);
        return true;
      }

      // Hard cap: never exceed MAX_QUESTIONS total
      if (state.questionCount >= MAX_QUESTIONS) {
        await this.completeInterview(sessionId);
        return true;
      }
      
      const history = await this.deps.contextManager.getHistory(sessionId);
      const avgScore = state.questionCount > 0 ? state.scoreAccumulator / state.questionCount : 0;

      // Retrieve latest topic performance to pass confidence signal
      const topicState = await (this.deps.stateStore as any).getTopicState?.(sessionId);
      const latestPerf = topicId && topicState?.performanceRecord?.[topicId];
      const latestConfidence = latestPerf?.averageConfidence;

      state.difficulty = this.deps.adaptiveDifficulty.calculateNextDifficulty(
        avgScore,
        history,
        { timeTakenMs: latestPerf?.timeTaken, confidenceScore: latestConfidence }
      );

      const generation = await this.deps.questionGenerator.generate(topicId, history, state.difficulty);
      
      await this.askQuestion(state, generation.text, generation.expectedConcepts);
      return false; // next question ready
    } catch (error: any) {
      state.status = InterviewState.ERROR;
      await this.deps.stateStore.setSessionState(sessionId, state);
      this.deps.errorHandler.logError(error, sessionId);
      throw error;
    }
  }

  private async askQuestion(state: IInterviewSessionState, questionText: string, expectedConcepts: string[]): Promise<void> {
    state.currentQuestion = questionText;
    state.expectedConcepts = expectedConcepts;
    state.status = InterviewState.WAITING_FOR_ANSWER;
    state.questionStartTime = Date.now(); // Record when question was sent (for server-side timing)

    await this.deps.stateStore.setSessionState(state.sessionId, state);

    await this.deps.contextManager.addToHistory(state.sessionId, 'interviewer', questionText);
    
    this.deps.websocketManager.sendMessageToSession(state.sessionId, 'NEW_QUESTION', {
      question: questionText,
      topic: state.currentTopic,
      isFollowUp: state.isFollowUp
    });
  }

  public async endInterview(sessionId: string): Promise<string> {
    const state = await this.deps.stateStore.getSessionState(sessionId);
    if (!state) throw new Error('Session not found');
    await this.completeInterview(sessionId);
    
    // We can assume the report was created for state.interviewId
    // fetch report ID if needed, or just return interviewId and we will find it
    const report = await this.deps.database.interviewReports.findByInterviewId(state.interviewId);
    return report ? report.id : state.interviewId;
  }

  private async completeInterview(sessionId: string): Promise<void> {
    const state = await this.deps.stateStore.getSessionState(sessionId);
    if (!state) return;
    state.status = InterviewState.COMPLETED;
    await this.deps.stateStore.setSessionState(sessionId, state);

    try {
      const history = await this.deps.contextManager.getHistory(sessionId);
      
      const reportData = await this.deps.reportGenerator.generateReport(sessionId, state.interviewId, history);
      const overallScore = state.questionCount > 0 ? state.scoreAccumulator / state.questionCount : 0;

      // ── Feature 7: Hiring Recommendation Engine Integration ──────────────
      let hiringDecision: string | undefined;
      if (this.deps.hiringRecommendationEngine) {
        try {
          const hiringResult = await this.deps.hiringRecommendationEngine.evaluateRecommendation({
            interviewType: state.roleId,
            sessionSummary: { sessionId, interviewId: state.interviewId, candidateId: state.candidateId },
            rubricEngineOutput: { overallScore, questionScores: [] },
            skillMatrix: { overallCoverage: overallScore, skills: [] },
            perQuestionEvaluations: [],
            technicalAccuracyReports: [],
            candidateAnalysisResults: [],
          });
          hiringDecision = hiringResult.recommendation;
          // Merge hiring data into reportData so the frontend gets it via GET /api/report
          (reportData as any).hiringRecommendation = hiringDecision;
          (reportData as any).hiringConfidence    = hiringResult.confidence;
          (reportData as any).hiringStrengths     = hiringResult.strengths;
          (reportData as any).hiringWeaknesses    = hiringResult.weaknesses;
          (reportData as any).hiringReasoning     = hiringResult.reasoning;
        } catch (hiringErr: any) {
          // Hiring engine failure is non-fatal — log and continue
          this.deps.errorHandler.logError(hiringErr, sessionId);
        }
      }
      
      const createdReport = await this.deps.database.interviewReports.create({
        interviewId: state.interviewId,
        overallScore,
        reportData
      });

      // Save rich metadata to the session record so the History page can display
      // the real score, reportId, candidate name, curriculum, and duration.
      const durationSeconds = (state as any).startedAt
        ? Math.round((Date.now() - (state as any).startedAt) / 1000)
        : 0;

      await this.deps.database.interviewSessions.update(state.interviewId, {
        status: 'completed',
        endTime: new Date(),
        metadata: {
          overallScore:    Math.round(overallScore),
          reportId:        createdReport.id,
          durationSeconds,
          candidateName:   (reportData as any)?.candidateName  || `Candidate ${state.candidateId}`,
          curriculum:      state.roleId || 'Technical Assessment',
          hiringDecision,
        }
      });

      await this.deps.sessionManager.closeSession(sessionId);
      this.deps.websocketManager.sendMessageToSession(sessionId, 'INTERVIEW_COMPLETED', {
        report: reportData,
        hiringDecision,
      });
      
      await this.deps.stateStore.deleteSessionState(sessionId);
      this.deps.monitoring.incrementCounter('interview_completed_total', 1, { roleId: state.roleId });
    } catch (error: any) {
      this.deps.errorHandler.logError(error, sessionId);
    }
  }
}
