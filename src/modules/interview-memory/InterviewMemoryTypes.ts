export interface IMemoryQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: string;
  askedAt: number;
}

export interface IMemoryAnswer {
  id: string;
  questionId: string;
  answer: string;
  answeredAt: number;
}

export type MistakeCategory = 
  | 'misconception' 
  | 'syntax' 
  | 'missing_edge_case' 
  | 'communication' 
  | 'problem_solving' 
  | 'other';

export interface IMemoryMistake {
  id: string;
  description: string;
  category: MistakeCategory;
  topic: string;
  occurrences: number;
  firstObservedAt: number;
  lastObservedAt: number;
}

export interface IMemoryContext {
  currentTopic: string | null;
  previousTopic: string | null;
  currentDifficulty: string | null;
  topicsCompleted: string[];
  topicsSkipped: string[];
  strongTopics: string[];
  weakTopics: string[];
  followUpChain: string[];
  candidateConfidenceTrend: string[];
}

export interface IMemorySnapshot {
  questions: IMemoryQuestion[];
  answers: IMemoryAnswer[];
  mistakes: IMemoryMistake[];
  context: IMemoryContext;
}
