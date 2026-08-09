import { 
  IMemoryQuestion, 
  IMemoryAnswer, 
  IMemoryMistake, 
  IMemoryContext, 
  IMemorySnapshot,
  MistakeCategory
} from './InterviewMemoryTypes';

export interface IInterviewMemory {
  addQuestion(question: Omit<IMemoryQuestion, 'askedAt'>): void;
  hasQuestionBeenAsked(questionId: string): boolean;
  getQuestionsByTopic(topic: string): IMemoryQuestion[];
  getQuestionsByDifficulty(difficulty: string): IMemoryQuestion[];
  getAllQuestions(): IMemoryQuestion[];
  
  addAnswer(answer: Omit<IMemoryAnswer, 'answeredAt'>): void;
  getAnswerByQuestionId(questionId: string): IMemoryAnswer | undefined;
  getRecentAnswers(limit: number): IMemoryAnswer[];
  getAllAnswers(): IMemoryAnswer[];
  
  recordMistake(description: string, category: MistakeCategory, topic: string): void;
  getMostFrequentMistakes(limit: number): IMemoryMistake[];
  getMistakesByTopic(topic: string): IMemoryMistake[];
  getLatestMistake(): IMemoryMistake | undefined;
  getMistakeFrequency(description: string): number;
  getAllMistakes(): IMemoryMistake[];
  
  updateContext(updates: Partial<IMemoryContext>): void;
  getContext(): IMemoryContext;
  
  getSnapshot(): IMemorySnapshot;
  clear(): void;
}
