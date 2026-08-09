export enum SessionStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export type SessionId = string;
export type CandidateId = string;

export interface AnswerRecord {
  questionId: string;
  topic: string;
  answer: string;
  score?: number;
  feedback?: string;
  timestamp: Date;
}
