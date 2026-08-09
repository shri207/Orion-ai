import { ErrorLogger } from './ErrorLogger';
import { BaseAppException } from './AppExceptions';
import { LogLevel, ErrorCategory } from './ErrorTypes';

export class RetryUtility {
  public static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000,
    shouldRetry?: (error: any) => boolean
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        
        const isRetryable = shouldRetry 
          ? shouldRetry(error)
          : (error instanceof BaseAppException && 
             (error.category === ErrorCategory.NETWORK || 
              error.category === ErrorCategory.AI_PROVIDER || 
              error.category === ErrorCategory.EXTERNAL_API));

        if (!isRetryable || attempt >= maxRetries) {
          throw error;
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        
        ErrorLogger.log({
          level: LogLevel.WARNING,
          category: ErrorCategory.INTERNAL,
          code: 'RETRY_ATTEMPT',
          message: `Operation failed, retrying (${attempt}/${maxRetries}) in ${delay}ms`,
          details: { originalError: error.message },
          timestamp: new Date().toISOString()
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Unreachable code');
  }
}
