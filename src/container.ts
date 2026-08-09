import { ConfigurationManager } from './modules/config-manager';
import { ErrorLogger } from './modules/error-handler';
import { LogLevel, ErrorCategory } from './modules/error-handler/ErrorTypes';
import { MetricsRegistry, LlmMetricsTracker } from './modules/monitoring';
import { CandidateProfileRepository, InterviewSessionRepository, InterviewReportRepository } from './modules/database';
import { InterviewEngine } from './modules/interview-engine';

import { SessionManager } from './modules/session/SessionManager';
import { CurriculumLoader } from './modules/curriculum/CurriculumLoader';
import { CurriculumRepository } from './modules/curriculum/CurriculumRepository';
import { TopicSelector } from './modules/topic-selector/TopicSelector';
import { TopicSelectionMode } from './modules/topic-selector/TopicSelectorTypes';
import { RedisInterviewStateStore } from './infrastructure/redis/RedisInterviewStateStore';
import { OpenRouterClient } from './services/llm/OpenRouterClient';
import { QuestionGenerator } from './modules/question-generator/QuestionGenerator';
import { TechnicalAccuracyChecker } from './modules/technical-accuracy-checker/TechnicalAccuracyChecker';
import { CandidateAnalyzer } from './modules/candidate-analyzer/CandidateAnalyzer';
import { CandidateProfileAnalyzer } from './modules/candidate-profile-analyzer/CandidateProfileAnalyzer';
import { CandidateProfileAnalyzerService } from './modules/candidate-profile-analyzer/CandidateProfileAnalyzerService';
import { RubricEngine } from './modules/rubric-engine/RubricEngine';
import { FollowUpGenerator } from './modules/followup-generator/FollowUpGenerator';
import { ReportGenerator } from './modules/report-generator/ReportGenerator';
import { ReportFormatter } from './modules/report-generator/formatter';
import { ReportSummaryGenerator } from './modules/report-generator/summary';
import { RecommendationEngineAdapter } from './modules/report-generator/recommendation';
import { HiringRecommendationEngine } from './modules/hiring-recommendation-engine/HiringRecommendationEngine';
import { ConversationContextManager } from './modules/conversation-context-manager/ConversationContextManager';
import { TokenEstimator } from './modules/conversation-context-manager/TokenEstimator';
import { ConversationCompressor } from './modules/conversation-context-manager/ConversationCompressor';
import { MemoryRetriever } from './modules/conversation-context-manager/MemoryRetriever';
import { ContextAssembler } from './modules/conversation-context-manager/ContextAssembler';
import { IConversationContextConfig } from './modules/conversation-context-manager/ConversationContextTypes';
import { ISession } from './modules/session/SessionInterfaces';
import { InterviewDifficulty, ICandidateProfile } from './modules/candidate/CandidateTypes';
import { ITopic } from './modules/curriculum/CurriculumTypes';
import { ICandidateAnalyzerParams } from './modules/candidate-analyzer/CandidateAnalyzerTypes';
import { ICommunicationAnalyzerResult } from './modules/communication-analyzer/CommunicationAnalyzerTypes';
import { InterviewType } from './modules/question-generator/QuestionGeneratorTypes';
import { getIO } from './websocket/socket';
import fs from 'fs/promises';

export const config = ConfigurationManager.getInstance();

export const database = {
  candidateProfiles: new CandidateProfileRepository(),
  interviewSessions: new InterviewSessionRepository(),
  interviewReports: new InterviewReportRepository()
};

export const monitoring = {
  recordLlmCall: (payload: any) => new LlmMetricsTracker().recordLlmCall(payload),
  incrementCounter: (name: string, value?: number, tags?: any) => MetricsRegistry.getInstance().incrementCounter(name, value, tags)
};

export const errorHandler = {
  logError: (error: Error, requestId?: string) => ErrorLogger.log({
    level: LogLevel.ERROR,
    category: ErrorCategory.INTERNAL,
    message: error.message,
    code: 'ERR',
    timestamp: new Date().toISOString()
  })
};

// ==========================================
// REAL MODULE INSTANTIATIONS
// ==========================================
const realSessionManager = new SessionManager({
  save: async (session: any): Promise<string> => {
    const dbSession = await database.interviewSessions.create({
      candidateId: session.candidateId,
      status: session.status,
      startTime: session.createdAt,
      metadata: session.metadata
    });
    return dbSession.id;
  },
  findById: async (id: string) => database.interviewSessions.findById(id) as unknown as ISession,
  update: async (id: string, updates: any) => database.interviewSessions.update(id, updates) as unknown as ISession,
  delete: async (id: string) => { await database.interviewSessions.delete(id); }
});
const realCurriculumLoader = new CurriculumLoader(new CurriculumRepository());
const realTopicSelector = new TopicSelector();

// FakeLLMClient is only used in tests. We use a dynamic require so that the
// test file (outside rootDir) is never included in the production TS compilation.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const llmClient = process.env.NODE_ENV === 'test'
  ? new (require('../tests/mocks/FakeLLMClient').FakeLLMClient)()
  : new OpenRouterClient();
export { llmClient }; // Exported for tests to configure mocks

const realQuestionGenerator = new QuestionGenerator(llmClient);
const realAnswerValidator = new TechnicalAccuracyChecker(llmClient);
const realCandidateAnalyzer = new CandidateAnalyzer(llmClient);
export const candidateProfileAnalyzer = new CandidateProfileAnalyzer(llmClient);
export const candidateProfileAnalyzerService = new CandidateProfileAnalyzerService(candidateProfileAnalyzer);
const realScoringEngine = new RubricEngine(llmClient);
const realFollowUpGenerator = new FollowUpGenerator(llmClient);
const realReportGenerator = new ReportGenerator(new ReportFormatter(), new ReportSummaryGenerator(), new RecommendationEngineAdapter());

// Hiring Recommendation Engine (Feature 7)
const hiringRecommendationEngine = new HiringRecommendationEngine(llmClient, {
  minimumHireScore: 65,
  minimumTechnicalScore: 60,
  criticalGapPenalty: 5,
  severeFactualErrorPenalty: 8,
});

const tokenEstimator = new TokenEstimator();
const realContextManager = new ConversationContextManager(
  { maxTokens: 4000, historyPreservationRatio: 0.5 } as IConversationContextConfig,
  tokenEstimator,
  new ConversationCompressor(tokenEstimator),
  new MemoryRetriever(),
  new ContextAssembler(tokenEstimator)
);

// State tracker
export const stateStore = new RedisInterviewStateStore();

// ==========================================
// INTERVIEW ENGINE DEPENDENCY ADAPTERS
// ==========================================

export const sessionManager = {
  createSession: async (candidateId: string, roleId: string) => {
    // Ensure the candidate exists in Postgres before creating the session.
    // Cohort candidates (e.g. CAND-001) come from candidates.json and are not
    // pre-seeded in the DB, so we upsert them on first use.
    let existingCandidate = await database.candidateProfiles.findById(candidateId);
    if (!existingCandidate) {
      try {
        // Try to pull candidate details from the cohort JSON file
        const cohortRaw = await fs.readFile('d:/PROJECTS/candidates.json', 'utf-8');
        const cohortData = JSON.parse(cohortRaw) as { candidates: Array<{ member: { id: string; name: string; jobRole: string; yearsExperience: number } }> };
        const cohortEntry = cohortData.candidates.find(c => c.member.id === candidateId);

        const name = cohortEntry?.member.name ?? `Candidate ${candidateId}`;
        const role = cohortEntry?.member.jobRole ?? roleId;
        const exp  = cohortEntry?.member.yearsExperience != null ? String(cohortEntry.member.yearsExperience) : 'mid';

        // Use a stable synthetic email so upsert is idempotent
        const email = `${candidateId.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cohort.internal`;

        existingCandidate = await database.candidateProfiles.create({
          name,
          email,
          role,
          experienceLevel: exp,
        });
        console.log(`[SessionManager] Auto-created DB candidate for ${candidateId} → DB id: ${existingCandidate.id}`);
      } catch (upsertErr) {
        console.error('[SessionManager] Failed to upsert cohort candidate:', upsertErr);
        throw upsertErr;
      }
    }

    // Use the real Prisma UUID (existingCandidate.id) for the FK, regardless of
    // what external ID (CAND-001) was passed in.
    const session = await realSessionManager.createSession({ candidateId: existingCandidate.id, metadata: { roleId, externalCandidateId: candidateId } });
    await stateStore.clear(session.sessionId); // Clear any old state just in case
    await stateStore.setTopicState(session.sessionId, { remainingTopics: [], completedTopics: [], topicHistory: [], currentTopic: null });
    return { id: session.sessionId, interviewId: session.interviewId! };
  },
  closeSession: async (sessionId: string) => {
    await realSessionManager.endSession(sessionId);
    await stateStore.clear(sessionId);
  }
};

export const curriculumLoader = {
  loadCurriculum: async (roleId: string) => {
    try {
      const data = await fs.readFile('d:/PROJECTS/curriculum.json', 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load external curriculum, falling back', e);
      return await realCurriculumLoader.loadCurriculum('./src/data/curriculum/sample.json');
    }
  }
};

export const topicSelector = {
  getNextTopic: async (sessionId: string, curriculum: any, candidateProfile: any = {}) => {
    let state = (await stateStore.getTopicState(sessionId)) || { remainingTopics: [], completedTopics: [], topicHistory: [], currentTopic: null };
    
    // Build the full topic list from the curriculum
    let allTopics: any[] = [];
    if (curriculum.days) {
      allTopics = curriculum.days.map((d: any) => ({
        id: `day-${d.day}`,
        name: d.title,
        description: `Tools: ${d.tools ? d.tools.join(', ') : ''}. Objectives: ${d.objectives ? d.objectives.join(', ') : ''}`,
        subtopics: []
      }));
    } else {
      allTopics = curriculum.modules ? curriculum.modules.flatMap((m: any) => m.topics) : (curriculum.topics || []);
    }

    // FIRST CALL SEED: if remainingTopics is empty and no history yet, populate from curriculum.
    // This was the root cause of the interview completing instantly — the state was always
    // initialized with remainingTopics:[] so the selector returned null on the very first call.
    if (state.remainingTopics.length === 0 && state.topicHistory.length === 0 && allTopics.length > 0) {
      // ── RANDOMIZE: Fisher-Yates shuffle so topics are selected randomly across all 31 ──
      const allIds = allTopics.map((t: any) => t.id);
      for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
      }
      state = { ...state, remainingTopics: allIds };
      await stateStore.setTopicState(sessionId, state);
      console.log(`[TopicSelector] Seeded ${allIds.length} topics (randomised) for session ${sessionId}`);
    }

    // Determine interview phase
    const totalTopics = allTopics.length;
    const covered = state.completedTopics.length;
    let phase: 'START' | 'MIDDLE' | 'END' = 'START';
    if (totalTopics > 0) {
      if (covered > totalTopics * 0.7) phase = 'END';
      else if (covered > totalTopics * 0.3) phase = 'MIDDLE';
    }

    const result = realTopicSelector.selectNextTopic({
      candidateProfile,
      curriculumTopics: allTopics,
      topicState: state,
      interviewPhase: phase,
      remainingTimeMinutes: 45,
      adaptiveStrategy: envConfig.TOPIC_SELECTOR_ADAPTIVE_STRATEGY as any,
      currentDifficulty: 'Medium' as InterviewDifficulty,
      config: envConfig
    });
    
    if (result.selectedTopic) {
      await stateStore.setTopicState(sessionId, result.updatedTopicState);
      return result.selectedTopic.id;
    }
    return null;
  }
};

export const topicPerformanceTracker = {
  recordPerformance: async (sessionId: string, topicId: string, evaluation: any) => {
    const state = await stateStore.getTopicState(sessionId);
    if (!state) return;

    const { TopicPerformanceTracker } = await import('./modules/topic-selector/TopicPerformanceTracker');
    const newState = TopicPerformanceTracker.recordPerformance(state, topicId, evaluation);
    await stateStore.setTopicState(sessionId, newState);
  }
};

export const questionGenerator = {
  /**
   * Resolves a topic ID into full topic metadata from the curriculum.
   * This is the key fix: without this, the LLM only sees "day-5" as the topic
   * and generates generic questions instead of curriculum-specific ones.
   */
  _resolveTopic(topicId: string, curriculum: any): { id: string; name: string; description: string } {
    // Build a lookup map from the curriculum structure
    let allTopics: any[] = [];
    if (curriculum?.days) {
      allTopics = curriculum.days.map((d: any) => ({
        id: `day-${d.day}`,
        name: d.title || `Day ${d.day}`,
        description: [
          d.description ? d.description : '',
          d.objectives?.length ? `Learning objectives: ${d.objectives.join('; ')}` : '',
          d.tools?.length     ? `Tools/technologies covered: ${d.tools.join(', ')}` : '',
          d.topics?.length    ? `Topics: ${d.topics.join(', ')}` : '',
        ].filter(Boolean).join('\n'),
      }));
    } else if (curriculum?.modules) {
      allTopics = curriculum.modules.flatMap((m: any) =>
        (m.topics || []).map((t: any) => ({
          id: t.id,
          name: t.name || t.title || t.id,
          description: [
            t.description || '',
            t.objectives?.length  ? `Objectives: ${t.objectives.join('; ')}` : '',
            t.subtopics?.length   ? `Subtopics: ${t.subtopics.map((s: any) => s.name || s).join(', ')}` : '',
          ].filter(Boolean).join('\n'),
        }))
      );
    } else if (curriculum?.topics) {
      allTopics = curriculum.topics.map((t: any) => ({
        id: t.id,
        name: t.name || t.title || t.id,
        description: t.description || t.id,
      }));
    }

    const found = allTopics.find((t: any) => t.id === topicId);
    if (found) {
      console.log(`[QuestionGenerator] Resolved topic '${topicId}' → '${found.name}'`);
      return found;
    }
    // Graceful fallback if topic not found in curriculum
    console.warn(`[QuestionGenerator] Could not resolve topic '${topicId}' from curriculum — using ID as name`);
    return { id: topicId, name: topicId, description: topicId };
  },

  generate: async (topicId: string, candidateState: any, difficulty: string, curriculum?: any) => {
    // Resolve the real topic name and description from curriculum
    const topicObj = curriculum
      ? questionGenerator._resolveTopic(topicId, curriculum)
      : { id: topicId, name: topicId, description: topicId };

    const res = await realQuestionGenerator.generateQuestion({
      topic: topicObj as unknown as ITopic,
      difficulty: difficulty as InterviewDifficulty,
      interviewType: InterviewType.TECHNICAL,
      interviewRole: 'engineer',
      previousQuestions: [],
      candidateProfile: candidateState
    });
    const resultObj = res as unknown as Record<string, any>;
    return { text: resultObj.questionText || resultObj.question || resultObj.text || 'Question?', expectedConcepts: resultObj.expectedConcepts || [] };
  }
};

export const answerValidator = {
  validate: async (answer: string) => {
    const res = await realAnswerValidator.evaluateAccuracy({ 
      interviewQuestion: '', 
      candidateAnswer: answer, 
      topicMetadata: '', 
      difficulty: 'Medium' as InterviewDifficulty, 
      expectedConcepts: [] 
    });
    return { isValid: res.technical_accuracy > 80, error: res.technical_feedback };
  }
};

export const candidateAnalyzer = {
  analyze: async (answer: string, expectedConcepts: string[]) => {
    const res = await realCandidateAnalyzer.analyzeAnswer({ candidateAnswer: answer, expectedConcepts, question: '' } as unknown as ICandidateAnalyzerParams);
    return res;
  }
};

export const scoringEngine = {
  score: async (analysis: any): Promise<number> => {
    // Derive a real score from the LLM analysis output:
    //   - technical_accuracy (0-100) carries the most weight
    //   - concepts_detected coverage gives a completion bonus
    //   - misconceptions and knowledge_gaps apply a small penalty
    const accuracy: number = typeof analysis?.technical_accuracy === 'number'
      ? analysis.technical_accuracy
      : typeof analysis?.technicalAccuracy === 'number'
        ? analysis.technicalAccuracy
        : 50; // neutral fallback

    const detected: any[] = analysis?.concepts_detected ?? [];
    const coverageBonus = detected.length > 0
      ? (detected.filter((c: any) => c.mentioned).length / detected.length) * 10
      : 0;

    const misconceptionPenalty = ((analysis?.misconceptions?.length ?? 0) + (analysis?.knowledge_gaps?.length ?? 0)) * 3;
    const confidence: number = typeof analysis?.confidence === 'number' ? analysis.confidence : 0;
    const confidenceBonus = confidence > 70 ? 5 : confidence > 40 ? 0 : -5;

    const raw = accuracy + coverageBonus + confidenceBonus - misconceptionPenalty;
    const clamped = Math.min(100, Math.max(0, Math.round(raw)));
    console.log(`[ScoringEngine] accuracy=${accuracy} coverage=+${coverageBonus.toFixed(1)} misconctions=-${misconceptionPenalty} confidence=${confidenceBonus} → ${clamped}`);
    return clamped;
  }
};

export const followUpGenerator = {
  needsFollowUp: (analysis: any) => {
    return (analysis.technical_accuracy || 0) < 80;
  },
  generateFollowUp: async (analysis: any, previousQuestion: string) => {
    const res = await realFollowUpGenerator.generateFollowUp({ 
      originalQuestion: previousQuestion, 
      candidateAnswer: analysis.candidateAnswer || '',
      topic: { id: 't1', name: 'Topic', description: 'desc' } as unknown as ITopic,
      difficulty: 'Medium' as InterviewDifficulty,
      interviewType: InterviewType.TECHNICAL,
      previousFollowUpQuestions: []
    });
    return res.followUpQuestion;
  }
};

export const reportGenerator = {
  // Per-question log: {topic, question, answer, score, analysis}
  _questionLog: [] as Array<{topic: string; question: string; answer: string; score: number; analysis: any}>,

  recordQuestion(topic: string, question: string, answer: string, score: number, analysis: any) {
    this._questionLog.push({ topic, question, answer, score, analysis });
  },

  generateReport: async (sessionId: string, interviewId: string, history: any[]) => {
    // Build per-topic score summary from the logged questions
    const topicMap = new Map<string, { scores: number[]; strengths: string[]; gaps: string[] }>();
    reportGenerator._questionLog.forEach(entry => {
      if (!topicMap.has(entry.topic)) topicMap.set(entry.topic, { scores: [], strengths: [], gaps: [] });
      const t = topicMap.get(entry.topic)!;
      t.scores.push(entry.score);
      // Collect strengths from concepts_detected that were mentioned
      (entry.analysis?.concepts_detected ?? []).forEach((c: any) => {
        if (c.mentioned && c.name) t.strengths.push(c.name);
      });
      // Collect gaps from knowledge_gaps and missing_concepts
      (entry.analysis?.knowledge_gaps ?? []).forEach((g: string) => t.gaps.push(g));
      (entry.analysis?.missing_concepts ?? []).forEach((g: string) => t.gaps.push(g));
    });

    const overallScore = reportGenerator._questionLog.length > 0
      ? reportGenerator._questionLog.reduce((s, e) => s + e.score, 0) / reportGenerator._questionLog.length
      : 0;

    // Build topSkills / areasForImprovement for the summary generator
    const topSkills: any[] = [];
    const areasForImprovement: any[] = [];
    topicMap.forEach((data, topic) => {
      const avg = data.scores.reduce((a, b) => a + b, 0) / (data.scores.length || 1);
      const uniqueStrengths = [...new Set(data.strengths)];
      const uniqueGaps = [...new Set(data.gaps)];
      if (avg >= 65) {
        topSkills.push({
          name: topic,
          score: avg,
          evidence: uniqueStrengths.length > 0
            ? `Demonstrated: ${uniqueStrengths.slice(0, 3).join(', ')}.`
            : `Scored ${avg.toFixed(0)}% on this topic.`
        });
      } else {
        areasForImprovement.push({
          name: topic,
          score: avg,
          evidence: uniqueGaps.length > 0
            ? `Gaps found: ${uniqueGaps.slice(0, 3).join(', ')}.`
            : `Only scored ${avg.toFixed(0)}% on this topic.`
        });
      }
    });

    // Build question history with topic tags for the formatter
    const taggedHistory = reportGenerator._questionLog.map((e, i) => ({
      id: `q${i}`,
      topic: e.topic,
      question: e.question,
      answer: e.answer,
    }));
    const taggedEvaluations = reportGenerator._questionLog.map((e, i) => ({
      questionId: `q${i}`,
      score: e.score,
      accuracy: e.analysis?.technical_accuracy ?? e.score,
      notes: e.analysis?.answer_summary ?? '',
    }));

    const result = realReportGenerator.generateReport({
      session: { sessionId, interviewId } as unknown as ISession,
      candidateProfile: {} as unknown as ICandidateProfile,
      questionHistory: taggedHistory,
      aiEvaluations: taggedEvaluations,
      rubricScores: {
        overall: overallScore,
        technical: overallScore,
        problemSolving: overallScore * 0.95,
        communication: overallScore * 0.9,
        confidence: overallScore * 1.0,
      },
      skillMatrix: { topSkills, areasForImprovement },
      communicationMetrics: { overallScore: overallScore * 0.9 } as unknown as ICommunicationAnalyzerResult,
    });

    // Attach the per-topic scores and full conversation log to reportData so
    // the report API route can expose them to the frontend History/Report pages.
    const topicScores = Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      score: Math.round(data.scores.reduce((a, b) => a + b, 0) / (data.scores.length || 1)),
      questionsAsked: data.scores.length,
    }));

    const conversation = reportGenerator._questionLog.map((e, i) => ({
      index:    i + 1,
      topic:    e.topic,
      question: e.question,
      answer:   e.answer,
      score:    e.score,
      analysis: {
        technicalAccuracy: e.analysis?.technical_accuracy,
        conceptsDetected:  (e.analysis?.concepts_detected ?? []).filter((c: any) => c.mentioned).map((c: any) => c.name),
        knowledgeGaps:     e.analysis?.knowledge_gaps ?? [],
        answerSummary:     e.analysis?.answer_summary ?? '',
      },
    }));

    (result as any).topicScores   = topicScores;
    (result as any).conversation  = conversation;
    (result as any).overallScore  = Math.round(overallScore);
    (result as any).scores = {
      overall:       Math.round(overallScore),
      technicalDepth: Math.round(overallScore * 0.95),
      communication:  Math.round(overallScore * 0.9),
      confidence:     Math.round(overallScore * 1.0),
      problemSolving: Math.round(overallScore * 0.95),
    };

    // Clear the log for next session
    reportGenerator._questionLog = [];
    return result;
  }
};

export const contextManager = {
  initializeContext: async (sessionId: string) => {
    // Only clear the conversation history for a fresh session.
    // Do NOT call stateStore.clear() here — that would wipe the session
    // state written by InterviewEngine.startInterview right before this call.
    const key = `interview:${sessionId}:history`;
    const client = stateStore.getClient();
    await client.del(key);
  },
  addToHistory: async (sessionId: string, role: 'interviewer' | 'candidate', content: string) => {
    await stateStore.appendHistory(sessionId, { role, content });
  },
  getHistory: async (sessionId: string) => {
    return await stateStore.getHistory(sessionId);
  }
};

export const adaptiveDifficulty = {
  /**
   * Calculates the next question difficulty based on:
   *  1. Speed   — how fast (ms) the candidate answered (faster = potentially escalate)
   *  2. Ease    — the LLM-derived confidence score (high confidence = potentially escalate)
   *  3. Score   — rolling average score across all questions (primary fallback)
   *
   * Difficulty levels: easy → medium → hard → expert
   */
  calculateNextDifficulty(
    currentScore: number,
    _history: any[],
    opts?: { timeTakenMs?: number; confidenceScore?: number }
  ): string {
    const LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
    type Level = typeof LEVELS[number];

    // Determine current difficulty bucket from the accumulated score
    const scoreLevel: Level =
      currentScore >= 90 ? 'expert'
      : currentScore >= 75 ? 'hard'
      : currentScore >= 55 ? 'medium'
      : 'easy';

    let currentIdx = LEVELS.indexOf(scoreLevel);

    // ── Speed signal ────────────────────────────────────────────────────────
    // Fast answers (< 30 s) suggest the question was easy → escalate
    // Slow answers (> 120 s) suggest the question was hard → de-escalate
    const FAST_MS  = 30_000;  // 30 seconds
    const SLOW_MS  = 120_000; // 2 minutes

    if (opts?.timeTakenMs !== undefined) {
      if (opts.timeTakenMs < FAST_MS)  currentIdx = Math.min(LEVELS.length - 1, currentIdx + 1);
      if (opts.timeTakenMs > SLOW_MS)  currentIdx = Math.max(0, currentIdx - 1);
    }

    // ── Confidence signal ────────────────────────────────────────────────────
    // High confidence (> 80) with a fast answer is a strong escalation signal
    // Low confidence (< 40) with a slow answer is a strong de-escalation signal
    if (opts?.confidenceScore !== undefined) {
      const { confidenceScore, timeTakenMs } = opts;
      if (confidenceScore > 80 && (timeTakenMs === undefined || timeTakenMs < FAST_MS)) {
        currentIdx = Math.min(LEVELS.length - 1, currentIdx + 1);
      }
      if (confidenceScore < 40 && (timeTakenMs === undefined || timeTakenMs > SLOW_MS)) {
        currentIdx = Math.max(0, currentIdx - 1);
      }
    }

    const next = LEVELS[currentIdx];
    console.log(
      `[AdaptiveDifficulty] score=${currentScore.toFixed(1)}% | ` +
      `timeTakenMs=${opts?.timeTakenMs ?? 'n/a'} | ` +
      `confidence=${opts?.confidenceScore ?? 'n/a'} → ${next}`
    );
    return next;
  }
};

export const websocketManager = {
  sendMessageToSession: (sessionId: string, type: string, payload: any) => {
    const io = getIO();
    if (io) {
      console.log(`[WS Broadcast] Emitting '${type}' to room ${sessionId}`);
      io.to(sessionId).emit(type, payload);
    } else {
      console.log(`[WS Broadcast Failed] io not ready for ${sessionId} -> ${type}`);
    }
  }
};

import { PromptSecurityService } from './modules/security/services/PromptSecurityService';
import { JwtService } from './modules/security/services/JwtService';
import { EnvApiKeyRepository } from './modules/security/repositories/EnvApiKeyRepository';
import { RateLimiterFactory } from './modules/security/RateLimiter';
import { validateEnv } from './modules/config-manager/env.schema';
import { JwtAuthenticationMiddleware } from './modules/security/middlewares/JwtAuthenticationMiddleware';
import { ApiKeyMiddleware } from './modules/security/middlewares/ApiKeyMiddleware';

const envConfig = validateEnv();

export const jwtService = new JwtService(envConfig);
export const apiKeyRepository = new EnvApiKeyRepository(envConfig);
export const rateLimiterFactory = new RateLimiterFactory(stateStore.getClient());

export const jwtAuthMiddleware = new JwtAuthenticationMiddleware(jwtService);
export const apiKeyMiddleware = new ApiKeyMiddleware(apiKeyRepository);
export const promptSecurityService = new PromptSecurityService();

export const interviewEngine = new InterviewEngine({
  sessionManager,
  curriculumLoader,
  topicSelector,
  topicPerformanceTracker,
  questionGenerator,
  answerValidator,
  candidateAnalyzer,
  scoringEngine,
  followUpGenerator,
  reportGenerator,
  database,
  websocketManager,
  monitoring,
  errorHandler,
  contextManager,
  stateStore,
  adaptiveDifficulty,
  promptSecurity: promptSecurityService,
  hiringRecommendationEngine,
});
