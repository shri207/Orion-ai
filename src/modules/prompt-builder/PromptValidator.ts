import { IPromptValidator } from './PromptBuilderInterfaces';
import { IPromptMessage, IPromptValidationResult } from './PromptBuilderTypes';

export class PromptValidator implements IPromptValidator {
  public validate(messages: IPromptMessage[], maxTokens?: number, estimatedTokens?: number): IPromptValidationResult {
    const errors: string[] = [];

    if (!messages || messages.length === 0) {
      errors.push('Messages array cannot be empty');
      return { isValid: false, errors };
    }

    let hasSystem = false;
    let hasUser = false;

    for (const msg of messages) {
      if (!msg.content || msg.content.trim() === '') {
        errors.push(`Empty content found in message with role: ${msg.role}`);
      }
      if (msg.role === 'system') hasSystem = true;
      if (msg.role === 'user') hasUser = true;
    }

    if (!hasSystem) {
      errors.push('System prompt is missing');
    }
    
    if (!hasUser) {
      errors.push('User prompt is missing');
    }

    if (maxTokens && estimatedTokens && estimatedTokens > maxTokens) {
      errors.push(`Estimated tokens (${estimatedTokens}) exceed maximum allowed tokens (${maxTokens})`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
