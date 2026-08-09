import { 
  IConversationContextManager, 
  ITokenEstimator, 
  IConversationCompressor,
  IMemoryRetriever,
  IContextAssembler
} from './ConversationContextInterfaces';
import { 
  IContextMessage, 
  IAssembledContext, 
  IContextSnapshot,
  IConversationContextConfig
} from './ConversationContextTypes';
import { IInterviewMemory } from '../interview-memory/InterviewMemoryInterfaces';
import crypto from 'crypto';

export class ConversationContextManager implements IConversationContextManager {
  private fullHistory: IContextMessage[] = [];
  private snapshots: Map<string, IContextSnapshot> = new Map();
  
  constructor(
    private readonly config: IConversationContextConfig,
    private readonly tokenEstimator: ITokenEstimator,
    private readonly compressor: IConversationCompressor,
    private readonly memoryRetriever: IMemoryRetriever,
    private readonly assembler: IContextAssembler
  ) {}

  public addMessage(message: IContextMessage): void {
    const msgWithTokens = { 
      ...message, 
      tokens: message.tokens || this.tokenEstimator.estimateMessageTokens(message) 
    };
    this.fullHistory.push(msgWithTokens);
  }

  public getOptimizedContext(memory: IInterviewMemory, currentTopic: string, pendingFollowUp: boolean): IAssembledContext {
    let recentMessages: IContextMessage[] = [];
    let oldMessages: IContextMessage[] = [];
    
    const splitIndex = Math.max(0, this.fullHistory.length - 5);
    oldMessages = this.fullHistory.slice(0, splitIndex);
    recentMessages = this.fullHistory.slice(splitIndex);

    const maxCompressionTokens = Math.floor(this.config.maxTokens * this.config.historyPreservationRatio);
    
    const compressedHistory = this.compressor.compress(oldMessages, maxCompressionTokens);
    const relevantMemories = this.memoryRetriever.retrieve(memory, currentTopic, recentMessages, 5);
    
    return this.assembler.assemble(
      memory,
      recentMessages,
      compressedHistory,
      relevantMemories,
      this.config
    );
  }

  public createSnapshot(context: IAssembledContext): IContextSnapshot {
    const id = crypto.randomUUID();
    const snapshot: IContextSnapshot = {
      id,
      timestamp: Date.now(),
      context: JSON.parse(JSON.stringify(context))
    };
    this.snapshots.set(id, snapshot);
    return snapshot;
  }

  public getSnapshot(id: string): IContextSnapshot | undefined {
    return this.snapshots.get(id);
  }

  public clear(): void {
    this.fullHistory = [];
    this.snapshots.clear();
  }
}
