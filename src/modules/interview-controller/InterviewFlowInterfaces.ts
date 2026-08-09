import { SessionId } from '../session/SessionTypes';
import { IInterviewProgress, InterviewState } from './InterviewFlowTypes';

export interface IInterviewFlowController {
  startInterview(sessionId: SessionId): Promise<void>;
  resumeInterview(sessionId: SessionId): Promise<void>;
  pauseInterview(sessionId: SessionId): Promise<void>;
  endInterview(sessionId: SessionId, reason?: string): Promise<void>;
  
  submitAnswer(sessionId: SessionId, answer: string): Promise<void>;
  nextQuestion(sessionId: SessionId): Promise<void>;
  skipQuestion(sessionId: SessionId): Promise<void>;
  skipTopic(sessionId: SessionId): Promise<void>;
  
  getInterviewStatus(sessionId: SessionId): Promise<InterviewState>;
  getProgress(sessionId: SessionId): Promise<IInterviewProgress>;
}
