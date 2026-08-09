import { ILLMClient, ILLMMessage, ILLMRequestOptions, ILLMResponse } from './LLMInterfaces';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class OpenRouterClient implements ILLMClient {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async generateCompletion(messages: ILLMMessage[], options?: ILLMRequestOptions): Promise<ILLMResponse> {
    const model = options?.model || env.OPENROUTER_MODEL;
    const temperature = options?.temperature ?? env.QUESTION_TEMPERATURE;
    const timeout = options?.timeout || env.OPENROUTER_TIMEOUT;
    const maxRetries = 3;
    let attempt = 0;

    const body = {
      model,
      messages,
      temperature,
      response_format: options?.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
    };

    while (attempt < maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const startTime = Date.now();
        const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://ai-interview-agent.com',
            'X-Title': 'AI Interview Agent',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('OpenRouter API returned empty choices array');
        }

        const content = data.choices[0].message.content;
        const usage = {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        };

        logger.info({ 
          model, 
          durationMs: duration, 
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens 
        }, 'LLM generation successful');

        return {
          content,
          model: data.model || model,
          usage
        };

      } catch (error: unknown) {
        const errMessage = error instanceof Error ? error.message : String(error);
        logger.error({ attempt, error: errMessage }, 'LLM generation failed');
        if (attempt >= maxRetries) {
          throw new Error(`LLM generation failed after ${maxRetries} attempts. Last error: ${errMessage}`);
        }
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
    
    throw new Error('Unexpected termination of retry loop');
  }
}
