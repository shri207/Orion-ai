export interface ILLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ILLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  responseFormat?: 'json_object' | 'text';
}

export interface ILLMResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ILLMClient {
  generateCompletion(messages: ILLMMessage[], options?: ILLMRequestOptions): Promise<ILLMResponse>;
}
