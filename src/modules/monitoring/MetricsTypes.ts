export enum MetricType {
  COUNTER = 'COUNTER',
  GAUGE = 'GAUGE',
  HISTOGRAM = 'HISTOGRAM'
}

export interface IMetricTags {
  [key: string]: string | number | boolean;
}

export interface IMetricValue {
  value: number;
  tags: IMetricTags;
  timestamp: number;
}

export interface IMetric {
  name: string;
  type: MetricType;
  description: string;
  values: IMetricValue[];
}

export interface IHealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  components: {
    database: 'UP' | 'DOWN' | 'UNKNOWN';
    aiProvider: 'UP' | 'DOWN' | 'UNKNOWN';
    cache: 'UP' | 'DOWN' | 'UNKNOWN';
  };
  timestamp: string;
  uptime: number;
}

export interface ILlmMetricPayload {
  modelName: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  latencyMs: number;
  isCacheHit: boolean;
  isRetry: boolean;
}
