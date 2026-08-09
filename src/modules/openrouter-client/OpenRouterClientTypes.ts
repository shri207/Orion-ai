export interface IOpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IOpenRouterRequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string | string[];
  stream?: boolean;
}

export interface IOpenRouterResponseChoice {
  message?: {
    role: string;
    content: string;
  };
  delta?: {
    role?: string;
    content?: string;
  };
  finish_reason: string | null;
}

export interface IOpenRouterResponse {
  id: string;
  model: string;
  choices: IOpenRouterResponseChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface IOpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  requestTimeoutMs?: number;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  fallbackModel?: string;
}

export interface IOpenRouterLogContext {
  model: string;
  latencyMs: number;
  provider?: string;
  success: boolean;
  retries: number;
  requestId?: string;
  error?: string;
}
