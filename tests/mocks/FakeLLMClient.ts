import { ILLMClient, ILLMMessage, ILLMRequestOptions, ILLMResponse } from '../../src/services/llm/LLMInterfaces';

export class FakeLLMClient implements ILLMClient {
  public defaultResponse: string = '{}';
  public responseOverrides: ((messages: ILLMMessage[]) => string | null)[] = [];
  public callCount = 0;
  public lastMessages: ILLMMessage[] = [];

  public async generateCompletion(messages: ILLMMessage[], options?: ILLMRequestOptions): Promise<ILLMResponse> {
    this.callCount++;
    this.lastMessages = messages;

    let content = this.defaultResponse;
    for (const override of this.responseOverrides) {
      const result = override(messages);
      if (result !== null) {
        content = result;
        break;
      }
    }

    return {
      content,
      model: 'fake-model',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30
      }
    };
  }
}
