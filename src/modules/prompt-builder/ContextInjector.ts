import { IContextInjector } from './PromptBuilderInterfaces';
import { IAssembledContext } from '../conversation-context-manager/ConversationContextTypes';

export class ContextInjector implements IContextInjector {
  public inject(context: IAssembledContext): string {
    if (!context) return '';
    return `
Active Topic: ${context.currentState?.activeTopic || 'Unknown'}
Difficulty Level: ${context.currentState?.difficultyLevel || 'Unknown'}
Pending Follow Up: ${context.currentState?.pendingFollowUp ? 'Yes' : 'No'}
Compressed History Summary:
${context.compressedHistory?.summary || 'None'}
Relevant Memories:
${JSON.stringify(context.relevantMemories || [], null, 2)}
    `.trim();
  }
}
