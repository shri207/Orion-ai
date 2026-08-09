import { ErrorCategory, LogLevel } from './ErrorTypes';

export class BaseAppException extends Error {
  public readonly isOperational: boolean;
  
  constructor(
    public readonly category: ErrorCategory,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly level: LogLevel = LogLevel.ERROR,
    isOperational: boolean = true,
    public readonly details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export class ValidationException extends BaseAppException {
  constructor(message: string, details?: any) {
    super(ErrorCategory.VALIDATION, message, 400, 'VALIDATION_ERROR', LogLevel.WARNING, true, details);
  }
}

export class SecurityException extends BaseAppException {
  constructor(message: string, code: string = 'UNAUTHORIZED', statusCode: number = 401, details?: any) {
    super(ErrorCategory.SECURITY, message, statusCode, code, LogLevel.WARNING, true, details);
  }
}

export class AuthenticationException extends BaseAppException {
  constructor(message: string = 'Authentication failed') {
    super(ErrorCategory.AUTHENTICATION, message, 401, 'UNAUTHORIZED', LogLevel.WARNING, true);
  }
}

export class AuthorizationException extends BaseAppException {
  constructor(message: string = 'Insufficient permissions') {
    super(ErrorCategory.AUTHORIZATION, message, 403, 'FORBIDDEN', LogLevel.WARNING, true);
  }
}

export class DatabaseException extends BaseAppException {
  constructor(message: string, details?: any) {
    super(ErrorCategory.DATABASE, message, 500, 'DATABASE_ERROR', LogLevel.ERROR, true, details);
  }
}

export class AiProviderException extends BaseAppException {
  constructor(message: string, details?: any) {
    super(ErrorCategory.AI_PROVIDER, message, 502, 'AI_PROVIDER_ERROR', LogLevel.ERROR, true, details);
  }
}

export class RateLimitException extends BaseAppException {
  constructor(message: string = 'Too many requests') {
    super(ErrorCategory.RATE_LIMIT, message, 429, 'RATE_LIMIT_EXCEEDED', LogLevel.WARNING, true);
  }
}

export class ConfigurationException extends BaseAppException {
  constructor(message: string) {
    super(ErrorCategory.CONFIGURATION, message, 500, 'CONFIG_ERROR', LogLevel.CRITICAL, false);
  }
}
