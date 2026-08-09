import { IContextAssembler, ITokenEstimator } from './ConversationContextInterfaces';
import { 
  IAssembledContext, 
  IContextMessage, 
  ICompressedHistory, 
  IRelevantMemory,
  IConversationContextConfig
} from './ConversationContextTypes';
import { IInterviewMemory } from '../interview-memory/InterviewMemoryInterfaces';

export class ContextAssembler implements IContextAssembler {
  constructor(private readonly tokenEstimator: ITokenEstimator) {}

  public assemble(
    memory: IInterviewMemory,
    recentConversation: IContextMessage[],
    compressedHistory: ICompressedHistory,
    relevantMemories: IRelevantMemory[],
    config: IConversationContextConfig
  ): IAssembledContext {
    const memoryContext = memory.getContext();
    
    const context: IAssembledContext = {
      systemPrompt: 'You are an expert technical interviewer.',
      recentConversation,
      compressedHistory,
      relevantMemories,
      currentState: {
        activeTopic: memoryContext.currentTopic || 'General',
        difficultyLevel: memoryContext.currentDifficulty || 'Medium',
        pendingFollowUp: memoryContext.followUpChain.length > 0
      },
      totalEstimatedTokens: 0
    };

    context.totalEstimatedTokens = this.tokenEstimator.estimateContextTokens(context);

    return context;
  }
}
