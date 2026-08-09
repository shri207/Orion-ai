import { IRetryStrategy, ITimeProvider, IOpenRouterLogger } from './OpenRouterClientInterfaces';
import { OpenRouterError } from './OpenRouterError';

export class RetryManager implements IRetryStrategy {
  constructor(
    private readonly maxRetries: number,
    private readonly baseDelayMs: number,
    private readonly timeProvider: ITimeProvider,
    private readonly logger?: IOpenRouterLogger
  ) {}

  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    let attempt = 0;
    
    while (true) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        
        const isRetryable = error instanceof OpenRouterError ? error.retryable : true;
        
        if (attempt > this.maxRetries || !isRetryable) {
          throw error;
        }

        const delay = this.baseDelayMs * Math.pow(2, attempt - 1);
        if (this.logger) {
          this.logger.warn(`Operation failed, retrying in ${delay}ms... (Attempt ${attempt}/${this.maxRetries})`, { error: error.message });
        }
        
        await this.timeProvider.sleep(delay);
      }
    }
  }
}
