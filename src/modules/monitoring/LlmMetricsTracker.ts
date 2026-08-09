import { ILlmMetricPayload } from './MetricsTypes';
import { MetricsRegistry } from './MetricsRegistry';
import { ConfigurationManager } from '../config-manager';

export class LlmMetricsTracker {
  constructor(private readonly registry: MetricsRegistry = MetricsRegistry.getInstance()) {}

  public recordLlmCall(payload: ILlmMetricPayload): void {
    const config = ConfigurationManager.getInstance().getConfig();
    if (!config.monitoring.enabled) return;

    const tags = {
      model: payload.modelName,
      provider: payload.provider,
      cacheHit: payload.isCacheHit,
      retry: payload.isRetry
    };

    this.registry.incrementCounter('llm_requests_total', 1, tags);
    this.registry.incrementCounter('llm_tokens_prompt_total', payload.promptTokens, tags);
    this.registry.incrementCounter('llm_tokens_completion_total', payload.completionTokens, tags);
    this.registry.incrementCounter('llm_tokens_total', payload.totalTokens, tags);
    
    this.registry.incrementCounter('llm_estimated_cost_usd', payload.estimatedCost, tags);
    
    this.registry.recordHistogram('llm_request_duration_ms', payload.latencyMs, tags);
  }
}
