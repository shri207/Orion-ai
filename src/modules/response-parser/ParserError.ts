export enum ParserErrorCode {
  INVALID_JSON = 'INVALID_JSON',
  SCHEMA_VALIDATION_FAILURE = 'SCHEMA_VALIDATION_FAILURE',
  EMPTY_RESPONSE = 'EMPTY_RESPONSE',
  STREAM_INTERRUPTED = 'STREAM_INTERRUPTED',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  UNSUPPORTED_TYPE = 'UNSUPPORTED_TYPE',
  RECOVERY_FAILED = 'RECOVERY_FAILED'
}

export class ParserError extends Error {
  constructor(
    public readonly code: ParserErrorCode,
    message: string,
    public readonly originalResponse?: string,
    public readonly validationDetails?: any,
    public readonly recoveryAttempts?: number
  ) {
    super(message);
    this.name = 'ParserError';
  }
}
