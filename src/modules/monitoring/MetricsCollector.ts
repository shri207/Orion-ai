import { MetricsRegistry } from './MetricsRegistry';
import { ConfigurationManager } from '../config-manager';

export class MetricsCollector {
  private intervalId?: NodeJS.Timeout;
  private isEnabled: boolean;

  constructor(private readonly registry: MetricsRegistry = MetricsRegistry.getInstance()) {
    const config = ConfigurationManager.getInstance().getConfig();
    this.isEnabled = config.monitoring.enabled;
  }

  public startBackgroundAggregation(intervalMs: number = 60000): void {
    if (!this.isEnabled) return;
    
    this.intervalId = setInterval(() => {
      this.aggregateAndExport();
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private aggregateAndExport(): void {
    const metrics = this.registry.getAllMetrics();
    this.registry.clear();
  }
}
