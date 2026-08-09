import { IParserMetrics } from './ResponseParserInterfaces';
import { IParserMetricsData } from './ResponseParserTypes';

export class ParserMetrics implements IParserMetrics {
  private metrics: IParserMetricsData = {
    parseDurationMs: 0,
    recoveryAttempts: 0,
    successfulRecoveries: 0,
    validationFailures: 0,
    responseSizeBytes: 0,
    estimatedTokens: 0
  };

  public record(metrics: Partial<IParserMetricsData>): void {
    this.metrics.parseDurationMs += metrics.parseDurationMs || 0;
    this.metrics.recoveryAttempts += metrics.recoveryAttempts || 0;
    this.metrics.successfulRecoveries += metrics.successfulRecoveries || 0;
    this.metrics.validationFailures += metrics.validationFailures || 0;
    this.metrics.responseSizeBytes += metrics.responseSizeBytes || 0;
    this.metrics.estimatedTokens += metrics.estimatedTokens || 0;
  }

  public getSummary(): IParserMetricsData {
    return { ...this.metrics };
  }
}
