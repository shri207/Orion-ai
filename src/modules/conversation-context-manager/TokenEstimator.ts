import { ITokenEstimator } from './ConversationContextInterfaces';
import { IContextMessage, IAssembledContext } from './ConversationContextTypes';

export class TokenEstimator implements ITokenEstimator {
  public estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public estimateMessageTokens(message: IContextMessage): number {
    let tokens = this.estimateTokens(message.content);
    tokens += 4; 
    return tokens;
  }

  public estimateContextTokens(context: IAssembledContext): number {
    let total = 0;
    total += this.estimateTokens(context.systemPrompt);
    total += context.recentConversation.reduce((acc, msg) => acc + this.estimateMessageTokens(msg), 0);
    total += this.estimateTokens(context.compressedHistory.summary);
    total += this.estimateTokens(JSON.stringify(context.compressedHistory.preservedTechnicalDetails));
    total += this.estimateTokens(JSON.stringify(context.compressedHistory.preservedReasoning));
    total += this.estimateTokens(JSON.stringify(context.relevantMemories));
    total += this.estimateTokens(JSON.stringify(context.currentState));
    return total;
  }
}
