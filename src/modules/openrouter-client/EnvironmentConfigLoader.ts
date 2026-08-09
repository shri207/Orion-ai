import { IOpenRouterConfig } from './OpenRouterClientTypes';

export class EnvironmentConfigLoader {
  public static load(): IOpenRouterConfig {
    return {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseUrl: process.env.OPENROUTER_BASE_URL,
      defaultModel: process.env.DEFAULT_MODEL,
      requestTimeoutMs: process.env.REQUEST_TIMEOUT ? parseInt(process.env.REQUEST_TIMEOUT, 10) : undefined,
      maxRetries: process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES, 10) : undefined
    };
  }
}
