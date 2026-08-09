import { 
  IOpenRouterMessage, 
  IOpenRouterRequestOptions, 
  IOpenRouterResponse, 
  IOpenRouterLogContext 
} from './OpenRouterClientTypes';

export interface IOpenRouterClient {
  generateCompletion(
    messages: IOpenRouterMessage[], 
    options?: IOpenRouterRequestOptions
  ): Promise<IOpenRouterResponse>;
  
  generateStream(
    messages: IOpenRouterMessage[], 
    options?: IOpenRouterRequestOptions
  ): AsyncIterableIterator<IOpenRouterResponse>;
}

export interface IHttpClient {
  post(url: string, headers: Record<string, string>, body: any, timeoutMs: number): Promise<any>;
  postStream(url: string, headers: Record<string, string>, body: any, timeoutMs: number): Promise<any>;
}

export interface IOpenRouterLogger {
  info(message: string, context?: IOpenRouterLogContext): void;
  error(message: string, error?: any): void;
  warn(message: string, context?: any): void;
}

export interface IRetryStrategy {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}

export interface ITimeProvider {
  now(): number;
  sleep(ms: number): Promise<void>;
}
