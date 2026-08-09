import { IConversationCompressor, ITokenEstimator } from './ConversationContextInterfaces';
import { IContextMessage, ICompressedHistory } from './ConversationContextTypes';

export class ConversationCompressor implements IConversationCompressor {
  constructor(private readonly tokenEstimator: ITokenEstimator) {}

  public compress(history: IContextMessage[], maxTokens: number): ICompressedHistory {
    let currentTokens = 0;
    const summaryParts: string[] = [];
    const technicalDetails: string[] = [];
    const reasoning: string[] = [];
    const topics: Set<string> = new Set();

    for (const msg of history) {
      const tokens = this.tokenEstimator.estimateMessageTokens(msg);
      if (currentTokens + tokens > maxTokens) {
        break;
      }
      
      currentTokens += tokens;
      
      if (msg.role === 'assistant') {
        summaryParts.push(`Assistant asked/explained something (approx ${tokens} tokens)`);
      } else if (msg.role === 'user') {
        summaryParts.push(`Candidate provided answer (approx ${tokens} tokens)`);
        if (msg.content.includes('{') || msg.content.includes('function') || msg.content.includes('=>')) {
          technicalDetails.push(msg.content.substring(0, 150) + '...');
        }
        if (msg.content.toLowerCase().includes('because') || msg.content.toLowerCase().includes('therefore')) {
          reasoning.push(msg.content.substring(0, 150) + '...');
        }
      }
    }

    return {
      summary: summaryParts.join('\n'),
      mergedTopics: Array.from(topics),
      preservedTechnicalDetails: technicalDetails,
      preservedReasoning: reasoning
    };
  }
}
