export enum InterviewState {
  CREATED = 'CREATED',
  READY = 'READY',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  WAITING_FOR_ANSWER = 'WAITING_FOR_ANSWER',
  GENERATING_QUESTION = 'GENERATING_QUESTION',
  GENERATING_FOLLOW_UP = 'GENERATING_FOLLOW_UP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export interface IInterviewProgress {
  currentTopicId: string | null;
  topicsCompleted: number;
  totalTopics: number;
  questionsAsked: number;
  followUpsAsked: number;
  completionPercentage: number;
}

export interface IInterviewTimeTracker {
  startTime: Date | null;
  endTime: Date | null;
  totalDurationMs: number;
}

export interface IInterviewControllerConfig {
  maxFollowUpsPerTopic: number;
  maxQuestionsPerTopic: number;
  maxInterviewQuestions: number;
  maxInterviewDurationMinutes: number;
}
