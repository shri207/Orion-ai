import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';
import { InterviewEngine } from '../../src/modules/interview-engine/InterviewEngine';
import { IInterviewEngineDependencies, InterviewState } from '../../src/modules/interview-engine/InterviewEngineTypes';

describe('InterviewEngine', () => {
  let deps: ReturnType<typeof mockDeep<IInterviewEngineDependencies>>;
  let engine: InterviewEngine;

  beforeEach(() => {
    deps = mockDeep<IInterviewEngineDependencies>();
    engine = new InterviewEngine(deps);
  });

  describe('startInterview', () => {
    it('should initialize a session and return sessionId', async () => {
      const candidateId = 'cand-123';
      const roleId = 'role-456';
      const sessionId = 'session-789';
      const interviewId = 'interview-abc';

      deps.database.candidateProfiles.findById.mockResolvedValue({ id: candidateId });
      deps.sessionManager.createSession.mockResolvedValue({ id: sessionId, interviewId });
      deps.curriculumLoader.loadCurriculum.mockResolvedValue({ topics: [] });
      deps.topicSelector.getNextTopic.mockResolvedValue('first-topic');
      deps.topicPerformanceTracker.recordPerformance.mockResolvedValue(undefined);
      deps.questionGenerator.generate.mockResolvedValue({
        text: 'What is React?',
        expectedConcepts: ['Component', 'State']
      });
      deps.adaptiveDifficulty.calculateNextDifficulty.mockReturnValue('medium');
      
      deps.stateStore.getSessionState.mockImplementation(async () => {
        return {
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
          curriculum: { topics: [] },
          scoreAccumulator: 0,
          questionCount: 0
        } as any;
      });

      const result = await engine.startInterview(candidateId, roleId);

      expect(result).toBe(sessionId);
      expect(deps.monitoring.incrementCounter).toHaveBeenCalledWith('interview_start_attempt', 1, { roleId });
      expect(deps.contextManager.initializeContext).toHaveBeenCalledWith(sessionId);
      
      // Verify state was initialized and persisted
      expect(deps.stateStore.setSessionState).toHaveBeenCalledWith(sessionId, expect.objectContaining({
        sessionId,
        interviewId,
        candidateId,
        status: InterviewState.PROCESSING
      }));

      // Verify the first question was asked
      expect(deps.websocketManager.sendMessageToSession).toHaveBeenCalledWith(sessionId, 'NEW_QUESTION', {
        question: 'What is React?',
        topic: 'first-topic',
        isFollowUp: false
      });
    });

    it('should throw an error if candidate is not found', async () => {
      deps.database.candidateProfiles.findById.mockResolvedValue(null);

      await expect(engine.startInterview('invalid', 'role-456')).rejects.toThrow('Candidate not found');
      expect(deps.errorHandler.logError).toHaveBeenCalled();
    });
  });

  describe('submitAnswer', () => {
    it('should process a valid answer and ask the next question', async () => {
      const sessionId = 'session-123';
      const answer = 'React is a library.';

      const initialState = {
        sessionId,
        interviewId: 'int-1',
        candidateId: 'cand-1',
        roleId: 'role-1',
        status: InterviewState.WAITING_FOR_ANSWER,
        currentTopic: 'first-topic',
        currentQuestion: 'What is React?',
        expectedConcepts: ['Component'],
        isFollowUp: false,
        difficulty: 'medium',
        curriculum: {},
        scoreAccumulator: 0,
        questionCount: 0
      };

      deps.stateStore.getSessionState.mockResolvedValue(initialState as any);
      deps.answerValidator.validate.mockResolvedValue({ isValid: true });
      deps.candidateAnalyzer.analyze.mockResolvedValue({ technical_accuracy: 90, confidence: 0.95 });
      deps.scoringEngine.score.mockResolvedValue(8);
      deps.followUpGenerator.needsFollowUp.mockReturnValue(false); // No follow-up
      deps.topicSelector.getNextTopic.mockResolvedValue('second-topic');
      deps.questionGenerator.generate.mockResolvedValue({
        text: 'What is a Hook?',
        expectedConcepts: ['State']
      });

      await engine.submitAnswer(sessionId, answer);

      expect(deps.contextManager.addToHistory).toHaveBeenCalledWith(sessionId, 'candidate', answer);
      expect(deps.scoringEngine.score).toHaveBeenCalled();
      
      expect(deps.websocketManager.sendMessageToSession).toHaveBeenCalledWith(sessionId, 'NEW_QUESTION', expect.objectContaining({
        question: 'What is a Hook?'
      }));
    });

    it('should send validation error if answer is invalid', async () => {
      const sessionId = 'session-123';
      deps.stateStore.getSessionState.mockResolvedValue({
        status: InterviewState.WAITING_FOR_ANSWER
      } as any);
      
      deps.answerValidator.validate.mockResolvedValue({ isValid: false, error: 'Too short' });

      await engine.submitAnswer(sessionId, 'hi');

      expect(deps.websocketManager.sendMessageToSession).toHaveBeenCalledWith(sessionId, 'VALIDATION_ERROR', {
        message: 'Too short'
      });
    });
  });

  describe('endInterview', () => {
    it('should complete interview, generate report, and return report id', async () => {
      const sessionId = 'session-123';
      const interviewId = 'int-abc';
      
      deps.stateStore.getSessionState.mockResolvedValue({
        sessionId,
        interviewId,
        questionCount: 2,
        scoreAccumulator: 16
      } as any);

      deps.contextManager.getHistory.mockResolvedValue(['q1', 'a1']);
      deps.reportGenerator.generateReport.mockResolvedValue({ summary: 'good' });
      deps.database.interviewReports.findByInterviewId.mockResolvedValue({ id: 'report-123' } as any);

      const result = await engine.endInterview(sessionId);

      expect(result).toBe('report-123');
      expect(deps.database.interviewReports.create).toHaveBeenCalledWith(expect.objectContaining({
        interviewId,
        overallScore: 8 // 16 / 2
      }));
      expect(deps.database.interviewSessions.update).toHaveBeenCalledWith(interviewId, expect.objectContaining({
        status: 'completed'
      }));
      expect(deps.sessionManager.closeSession).toHaveBeenCalledWith(sessionId);
      expect(deps.websocketManager.sendMessageToSession).toHaveBeenCalledWith(sessionId, 'INTERVIEW_COMPLETED', expect.any(Object));
      expect(deps.stateStore.deleteSessionState).toHaveBeenCalledWith(sessionId);
    });
  });
});
