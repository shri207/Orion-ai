export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface IAppConfig {
  name: string;
  env: Environment;
  port: number;
  host: string;
  corsOrigins: string[];
}

export interface IModelConfig {
  provider: string;
  defaultModel: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
  fallbackModels: string[];
}

export interface IDbConfig {
  url: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl: boolean;
  poolSize: number;
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
}

export interface ILogConfig {
  level: string;
  format: 'json' | 'text';
  enableConsole: boolean;
  enableFile: boolean;
  logFilePath?: string;
}

export interface IMonitoringConfig {
  enabled: boolean;
  sentryDsn?: string;
  metricsPort?: number;
}

export interface IFeatureFlags {
  enableAudioAnalysis: boolean;
  enableVideoAnalysis: boolean;
  enableRealtimeSync: boolean;
  enablePdfExport: boolean;
}

export interface IAppConfiguration {
  app: IAppConfig;
  models: IModelConfig;
  database: IDbConfig;
  auth: IAuthConfig;
  logging: ILogConfig;
  monitoring: IMonitoringConfig;
  features: IFeatureFlags;
}
