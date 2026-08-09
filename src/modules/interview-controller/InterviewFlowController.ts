import { IInterviewFlowController } from './InterviewFlowInterfaces';
import { InterviewState, IInterviewProgress, IInterviewTimeTracker, IInterviewControllerConfig } from './InterviewFlowTypes';
import { SessionId } from '../session/SessionTypes';
import { ISession } from '../session/SessionInterfaces';
import { SessionManager } from '../session/SessionManager';
import { ITopicSelector } from '../topic-selector/TopicSelectorInterfaces';
import { IQuestionGenerator } from '../question-generator/QuestionGeneratorInterfaces';
import { IFollowUpGenerator } from '../followup-generator/FollowUpGeneratorInterfaces';
import { ICandidateRepository } from '../candidate/CandidateInterfaces';
import { ICurriculumRepository } from '../curriculum/CurriculumInterfaces';
import { TopicSelectionMode, ITopicState } from '../topic-selector/TopicSelectorTypes';
import { InterviewType } from '../question-generator/QuestionGeneratorTypes';
import { InterviewDifficulty } from '../candidate/CandidateTypes';
import { logger } from '../../utils/logger';

export class InterviewFlowController implements IInterviewFlowController {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly topicSelector: ITopicSelector,
    private readonly questionGenerator: IQuestionGenerator,
    private readonly followUpGenerator: IFollowUpGenerator,
    private readonly candidateRepository: ICandidateRepository,
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly config: IInterviewControllerConfig
  ) {}

  private async getSessionContext(sessionId: SessionId) {
    const session = await this.sessionManager.getSession(sessionId);
    const candidate = this.candidateRepository.getCandidate(session.candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${session.candidateId} not found`);
    }

    const metadata = session.metadata || {};
    const interviewState: InterviewState = metadata.interviewState || InterviewState.CREATED;
    const topicState: ITopicState = metadata.topicState || {
      completedTopics: [],
      currentTopic: null,
      topicHistory: [],
      remainingTopics: [],
    };
    const timeTracker: IInterviewTimeTracker = metadata.timeTracker || {
      startTime: null,
      endTime: null,
      totalDurationMs: 0,
    };
    const progress: IInterviewProgress = metadata.progress || {
      currentTopicId: null,
      topicsCompleted: 0,
      totalTopics: 0,
      questionsAsked: 0,
      followUpsAsked: 0,
      completionPercentage: 0,
    };
    
    const currentDifficulty: InterviewDifficulty = candidate.preferredDifficulty || 'Medium';

    return { session, candidate, metadata, interviewState, topicState, timeTracker, progress, currentDifficulty };
  }

  private async saveSessionContext(
    session: ISession,
    metadataUpdates: Record<string, any>,
    sessionUpdates: Partial<ISession> = {}
  ): Promise<ISession> {
    const newMetadata = { ...session.metadata, ...metadataUpdates };
    return this.sessionManager.saveSessionState(session.sessionId, {
      ...sessionUpdates,
      metadata: newMetadata,
    });
  }

  public async startInterview(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    
    if (ctx.interviewState !== InterviewState.CREATED && ctx.interviewState !== InterviewState.READY) {
      throw new Error(`Cannot start interview in state: ${ctx.interviewState}`);
    }

    const allTopics = this.curriculumRepository.getAllModules().flatMap(m => m.topics);
    ctx.progress.totalTopics = allTopics.length;
    ctx.timeTracker.startTime = new Date();

    await this.saveSessionContext(ctx.session, {
      interviewState: InterviewState.RUNNING,
      timeTracker: ctx.timeTracker,
      progress: ctx.progress,
    });

    logger.info({ sessionId }, 'InterviewStarted');
    await this.nextQuestion(sessionId);
  }

  public async resumeInterview(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    if (ctx.interviewState !== InterviewState.PAUSED) {
      throw new Error(`Cannot resume interview in state: ${ctx.interviewState}`);
    }
    
    await this.sessionManager.resumeSession(sessionId);
    await this.saveSessionContext(ctx.session, { interviewState: InterviewState.RUNNING });
    logger.info({ sessionId }, 'InterviewResumed');
  }

  public async pauseInterview(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    await this.sessionManager.pauseSession(sessionId);
    await this.saveSessionContext(ctx.session, { interviewState: InterviewState.PAUSED });
    logger.info({ sessionId }, 'InterviewPaused');
  }

  public async endInterview(sessionId: SessionId, reason?: string): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    ctx.timeTracker.endTime = new Date();
    if (ctx.timeTracker.startTime) {
      ctx.timeTracker.totalDurationMs = ctx.timeTracker.endTime.getTime() - new Date(ctx.timeTracker.startTime).getTime();
    }

    await this.sessionManager.endSession(sessionId);
    await this.saveSessionContext(ctx.session, {
      interviewState: InterviewState.COMPLETED,
      timeTracker: ctx.timeTracker,
      endReason: reason || 'Normal completion',
    });
    
    logger.info({ sessionId, reason }, 'InterviewCompleted');
  }

  public async submitAnswer(sessionId: SessionId, answer: string): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    
    if (ctx.interviewState !== InterviewState.WAITING_FOR_ANSWER) {
      throw new Error(`Cannot submit answer in state: ${ctx.interviewState}`);
    }

    const currentQ = ctx.session.currentQuestion;
    if (!currentQ) {
      throw new Error('No current question found to answer');
    }

    const answerRecord = {
      questionId: currentQ.id || 'q-unknown',
      topic: ctx.topicState.currentTopic || 'unknown',
      answer,
      timestamp: new Date()
    };
    
    const answeredQuestions = [...ctx.session.answeredQuestions, answerRecord];
    const isFollowUp = currentQ.isFollowUp;

    let nextAction: 'FOLLOW_UP' | 'NEXT_QUESTION' = 'NEXT_QUESTION';

    if (!isFollowUp && ctx.progress.followUpsAsked < this.config.maxFollowUpsPerTopic) {
      nextAction = 'FOLLOW_UP';
    }

    await this.saveSessionContext(ctx.session, 
      { interviewState: InterviewState.RUNNING }, 
      { answeredQuestions }
    );
    
    logger.info({ sessionId }, 'AnswerSubmitted');

    if (nextAction === 'FOLLOW_UP') {
      try {
        await this.generateFollowUp(sessionId, currentQ.question, answer);
      } catch (err) {
        logger.error({ err }, 'Failed to generate follow-up, moving to next question');
        await this.nextQuestion(sessionId);
      }
    } else {
      await this.nextQuestion(sessionId);
    }
  }

  public async nextQuestion(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    
    await this.saveSessionContext(ctx.session, { interviewState: InterviewState.GENERATING_QUESTION });

    try {
      if (ctx.progress.questionsAsked >= this.config.maxInterviewQuestions) {
        return this.endInterview(sessionId, 'Maximum interview questions reached');
      }

      if (ctx.timeTracker.startTime) {
        const elapsed = (Date.now() - new Date(ctx.timeTracker.startTime).getTime()) / 60000;
        if (elapsed >= this.config.maxInterviewDurationMinutes) {
          return this.endInterview(sessionId, 'Maximum interview duration reached');
        }
      }

      const allTopics = this.curriculumRepository.getAllModules().flatMap(m => m.topics);

      const topicResult = this.topicSelector.selectNextTopic({
        curriculumTopics: allTopics,
        topicState: ctx.topicState,
        mode: TopicSelectionMode.SEQUENTIAL,
        currentDifficulty: ctx.currentDifficulty,
      });

      if (!topicResult.selectedTopic) {
        return this.endInterview(sessionId, 'Curriculum completed');
      }

      const newTopicId = topicResult.selectedTopic.id;
      if (ctx.topicState.currentTopic && ctx.topicState.currentTopic !== newTopicId) {
        ctx.progress.topicsCompleted++;
        logger.info({ sessionId, previousTopic: ctx.topicState.currentTopic, newTopicId }, 'TopicChanged');
      }

      ctx.progress.currentTopicId = newTopicId;
      ctx.progress.completionPercentage = Math.round((ctx.progress.topicsCompleted / ctx.progress.totalTopics) * 100);

      const prevQTexts = ctx.session.answeredQuestions.map(q => q.questionId);

      const generatedQ = await this.questionGenerator.generateQuestion({
        topic: topicResult.selectedTopic,
        difficulty: topicResult.difficulty,
        interviewType: InterviewType.TECHNICAL,
        interviewRole: ctx.candidate.role,
        candidateProfile: ctx.candidate,
        previousQuestions: prevQTexts,
      });

      ctx.progress.questionsAsked++;

      const questionObj = {
        ...generatedQ,
        id: `q-${Date.now()}`,
        isFollowUp: false,
      };

      await this.saveSessionContext(
        ctx.session,
        {
          interviewState: InterviewState.WAITING_FOR_ANSWER,
          topicState: topicResult.updatedTopicState,
          progress: ctx.progress,
        },
        {
          currentTopic: newTopicId,
          currentQuestion: questionObj,
        }
      );

      logger.info({ sessionId, topicId: newTopicId }, 'QuestionGenerated');

    } catch (error: any) {
      logger.error({ sessionId, error: error.message }, 'Error in nextQuestion');
      await this.saveSessionContext(ctx.session, { interviewState: InterviewState.FAILED, error: error.message });
      throw error;
    }
  }

  private async generateFollowUp(sessionId: SessionId, originalQuestion: string, candidateAnswer: string): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    
    await this.saveSessionContext(ctx.session, { interviewState: InterviewState.GENERATING_FOLLOW_UP });

    try {
      const allTopics = this.curriculumRepository.getAllModules().flatMap(m => m.topics);
      const currentTopicObj = allTopics.find(t => t.id === ctx.topicState.currentTopic);

      if (!currentTopicObj) {
        throw new Error('No current topic to generate follow-up for');
      }

      const prevFollowUps: string[] = [];

      const generatedFollowUp = await this.followUpGenerator.generateFollowUp({
        originalQuestion,
        candidateAnswer,
        topic: currentTopicObj,
        difficulty: ctx.currentDifficulty,
        interviewType: InterviewType.TECHNICAL,
        previousFollowUpQuestions: prevFollowUps,
        candidateProfile: ctx.candidate,
      });

      ctx.progress.followUpsAsked++;

      const followUpObj = {
        question: generatedFollowUp.followUpQuestion,
        expectedAnswerSummary: generatedFollowUp.expectedAnswerSummary,
        evaluationCriteria: generatedFollowUp.evaluationCriteria,
        difficulty: generatedFollowUp.difficulty,
        topic: currentTopicObj.id,
        id: `fu-${Date.now()}`,
        isFollowUp: true,
        metadata: generatedFollowUp.metadata,
      };

      await this.saveSessionContext(
        ctx.session,
        {
          interviewState: InterviewState.WAITING_FOR_ANSWER,
          progress: ctx.progress,
        },
        {
          currentQuestion: followUpObj,
        }
      );

      logger.info({ sessionId }, 'FollowUpGenerated');

    } catch (error: any) {
      logger.error({ sessionId, error: error.message }, 'Error generating follow-up');
      await this.saveSessionContext(ctx.session, { interviewState: InterviewState.FAILED, error: error.message });
      throw error;
    }
  }

  public async skipQuestion(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    if (ctx.interviewState !== InterviewState.WAITING_FOR_ANSWER) {
       throw new Error(`Cannot skip question in state: ${ctx.interviewState}`);
    }
    logger.info({ sessionId }, 'Question skipped');
    await this.nextQuestion(sessionId);
  }

  public async skipTopic(sessionId: SessionId): Promise<void> {
    const ctx = await this.getSessionContext(sessionId);
    if (ctx.topicState.currentTopic) {
       ctx.topicState.completedTopics.push(ctx.topicState.currentTopic);
       ctx.topicState.remainingTopics = ctx.topicState.remainingTopics.filter(t => t !== ctx.topicState.currentTopic);
    }
    logger.info({ sessionId }, 'Topic skipped');
    await this.saveSessionContext(ctx.session, { topicState: ctx.topicState });
    await this.nextQuestion(sessionId);
  }

  public async getInterviewStatus(sessionId: SessionId): Promise<InterviewState> {
    const ctx = await this.getSessionContext(sessionId);
    return ctx.interviewState;
  }

  public async getProgress(sessionId: SessionId): Promise<IInterviewProgress> {
    const ctx = await this.getSessionContext(sessionId);
    return ctx.progress;
  }
}
