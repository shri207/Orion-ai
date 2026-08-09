import { IMetric, MetricType, IMetricTags } from './MetricsTypes';

export class MetricsRegistry {
  private static instance: MetricsRegistry;
  private metrics: Map<string, IMetric> = new Map();

  private constructor() {}

  public static getInstance(): MetricsRegistry {
    if (!MetricsRegistry.instance) {
      MetricsRegistry.instance = new MetricsRegistry();
    }
    return MetricsRegistry.instance;
  }

  private getOrCreateMetric(name: string, type: MetricType, description: string): IMetric {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { name, type, description, values: [] });
    }
    return this.metrics.get(name)!;
  }

  public incrementCounter(name: string, value: number = 1, tags: IMetricTags = {}, description: string = ''): void {
    const metric = this.getOrCreateMetric(name, MetricType.COUNTER, description);
    metric.values.push({ value, tags, timestamp: Date.now() });
  }

  public setGauge(name: string, value: number, tags: IMetricTags = {}, description: string = ''): void {
    const metric = this.getOrCreateMetric(name, MetricType.GAUGE, description);
    metric.values.push({ value, tags, timestamp: Date.now() });
  }

  public recordHistogram(name: string, value: number, tags: IMetricTags = {}, description: string = ''): void {
    const metric = this.getOrCreateMetric(name, MetricType.HISTOGRAM, description);
    metric.values.push({ value, tags, timestamp: Date.now() });
  }

  public getAllMetrics(): IMetric[] {
    return Array.from(this.metrics.values());
  }

  public clear(): void {
    this.metrics.forEach(m => m.values = []);
  }
}
