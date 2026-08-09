import { IMemorySnapshot, IMemoryMistake, IMemoryQuestion, IMemoryAnswer } from '../interview-memory/InterviewMemoryTypes';

export interface IContextMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens?: number;
}

export interface ICompressedHistory {
  summary: string;
  mergedTopics: string[];
  preservedTechnicalDetails: string[];
  preservedReasoning: string[];
}

export interface IRelevantMemory {
  relevanceScore: number;
  type: 'mistake' | 'question' | 'answer';
  content: any;
}

export interface IConversationContextConfig {
  maxTokens: number;
  historyPreservationRatio: number;
  compressionThreshold: number;
}

export interface IAssembledContext {
  systemPrompt: string;
  recentConversation: IContextMessage[];
  compressedHistory: ICompressedHistory;
  relevantMemories: IRelevantMemory[];
  currentState: {
    activeTopic: string;
    difficultyLevel: string;
    pendingFollowUp: boolean;
  };
  totalEstimatedTokens: number;
}

export interface IContextSnapshot {
  id: string;
  timestamp: number;
  context: IAssembledContext;
}
