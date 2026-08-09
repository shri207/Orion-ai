import { 
  IOpenRouterClient, 
  IHttpClient, 
  IOpenRouterLogger, 
  IRetryStrategy,
  ITimeProvider
} from './OpenRouterClientInterfaces';
import { 
  IOpenRouterConfig, 
  IOpenRouterMessage, 
  IOpenRouterRequestOptions, 
  IOpenRouterResponse 
} from './OpenRouterClientTypes';
import { RetryManager } from './RetryManager';
import { DefaultLogger, DefaultTimeProvider, FetchHttpClient } from './DefaultDependencies';

export class OpenRouterClient implements IOpenRouterClient {
  private readonly baseUrl: string;
  private readonly defaultModel: string;
  private readonly timeoutMs: number;
  private readonly retryStrategy: IRetryStrategy;

  constructor(
    private readonly config: IOpenRouterConfig,
    private readonly httpClient: IHttpClient = new FetchHttpClient(),
    private readonly logger: IOpenRouterLogger = new DefaultLogger(),
    private readonly timeProvider: ITimeProvider = new DefaultTimeProvider(),
    retryStrategy?: IRetryStrategy
  ) {
    if (!config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    this.defaultModel = config.defaultModel || 'openai/gpt-3.5-turbo';
    this.timeoutMs = config.requestTimeoutMs || 30000;
    
    this.retryStrategy = retryStrategy || new RetryManager(
      config.maxRetries ?? 3,
      config.retryBaseDelayMs ?? 1000,
      this.timeProvider,
      this.logger
    );
  }

  public async generateCompletion(messages: IOpenRouterMessage[], options?: IOpenRouterRequestOptions): Promise<IOpenRouterResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    const model = options?.model || this.defaultModel;
    
    const body = {
      model,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      top_p: options?.top_p,
      stop: options?.stop,
      stream: false
    };

    const headers = this.getHeaders();
    const startTime = this.timeProvider.now();

    try {
      const response = await this.retryStrategy.execute(() => this.httpClient.post(url, headers, body, this.timeoutMs));
      
      const latency = this.timeProvider.now() - startTime;
      this.logger.info('Completion generated successfully', {
        model,
        latencyMs: latency,
        success: true,
        retries: 0 
      });

      return response as IOpenRouterResponse;
    } catch (error: any) {
      this.logger.error('Failed to generate completion', error);
      throw error;
    }
  }

  public async *generateStream(messages: IOpenRouterMessage[], options?: IOpenRouterRequestOptions): AsyncIterableIterator<IOpenRouterResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    const model = options?.model || this.defaultModel;
    
    const body = {
      model,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      top_p: options?.top_p,
      stop: options?.stop,
      stream: true
    };

    const headers = this.getHeaders();

    const stream = await this.retryStrategy.execute(() => this.httpClient.postStream(url, headers, body, this.timeoutMs));

    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            return;
          }
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;
            try {
              const parsed = JSON.parse(dataStr);
              yield parsed as IOpenRouterResponse;
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/example/interview-system',
      'X-Title': 'Automated Interview System'
    };
  }
}
