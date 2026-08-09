import { 
  IContextMessage, 
  IAssembledContext, 
  IContextSnapshot, 
  IConversationContextConfig,
  ICompressedHistory,
  IRelevantMemory
} from './ConversationContextTypes';
import { IInterviewMemory } from '../interview-memory/InterviewMemoryInterfaces';

export interface ITokenEstimator {
  estimateTokens(text: string): number;
  estimateMessageTokens(message: IContextMessage): number;
  estimateContextTokens(context: IAssembledContext): number;
}

export interface IConversationCompressor {
  compress(history: IContextMessage[], maxTokens: number): ICompressedHistory;
}

export interface IMemoryRetriever {
  retrieve(
    memory: IInterviewMemory, 
    currentTopic: string, 
    recentConversation: IContextMessage[], 
    limit: number
  ): IRelevantMemory[];
}

export interface IContextAssembler {
  assemble(
    memory: IInterviewMemory,
    recentConversation: IContextMessage[],
    compressedHistory: ICompressedHistory,
    relevantMemories: IRelevantMemory[],
    config: IConversationContextConfig
  ): IAssembledContext;
}

export interface IConversationContextManager {
  addMessage(message: IContextMessage): void;
  getOptimizedContext(memory: IInterviewMemory, currentTopic: string, pendingFollowUp: boolean): IAssembledContext;
  createSnapshot(context: IAssembledContext): IContextSnapshot;
  getSnapshot(id: string): IContextSnapshot | undefined;
  clear(): void;
}
