export interface IParserConfig {
  enableRecovery: boolean;
  normalizeKeys: boolean;
  trimWhitespace: boolean;
}

export interface IValidationSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  items?: IValidationSchema;
}

export interface IParserMetricsData {
  parseDurationMs: number;
  recoveryAttempts: number;
  successfulRecoveries: number;
  validationFailures: number;
  responseSizeBytes: number;
  estimatedTokens: number;
}

export interface IParseResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  metrics: IParserMetricsData;
  recovered: boolean;
}

export interface IStreamParseResult<T> {
  isComplete: boolean;
  partialData?: Partial<T>;
  data?: T;
  error?: Error;
}
