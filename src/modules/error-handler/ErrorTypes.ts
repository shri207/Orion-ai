export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  AI_PROVIDER = 'AI_PROVIDER',
  NETWORK = 'NETWORK',
  SECURITY = 'SECURITY',
  EXTERNAL_API = 'EXTERNAL_API',
  FILE_HANDLING = 'FILE_HANDLING',
  CONFIGURATION = 'CONFIGURATION',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL'
}

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface IErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
  }
}

export interface IErrorLogPayload {
  level: LogLevel;
  category: ErrorCategory;
  message: string;
  code: string;
  stack?: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}
