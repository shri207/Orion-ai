"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeLLMClient = void 0;
class FakeLLMClient {
    defaultResponse = '{}';
    responseOverrides = [];
    callCount = 0;
    lastMessages = [];
    async generateCompletion(messages, options) {
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
exports.FakeLLMClient = FakeLLMClient;
