import { SessionStatus, SessionId, CandidateId, AnswerRecord } from './SessionTypes';

export interface ISession {
  sessionId: SessionId;
  interviewId?: string;
  candidateId: CandidateId;
  currentTopic: string | null;
  currentQuestion: any | null; // Generic any because there is no interview logic yet
  answeredQuestions: AnswerRecord[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  status: SessionStatus;
}

export interface ISessionRepository {
  save(session: ISession): Promise<string>;
  findById(sessionId: SessionId): Promise<ISession | null>;
  update(sessionId: SessionId, updates: Partial<ISession>): Promise<ISession>;
  delete(sessionId: SessionId): Promise<void>;
}

export interface ICreateSessionParams {
  candidateId: CandidateId;
  metadata?: Record<string, any>;
}
