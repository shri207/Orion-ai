export enum OpenRouterErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_REQUEST = 'INVALID_REQUEST',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export class OpenRouterError extends Error {
  constructor(
    public readonly code: OpenRouterErrorCode,
    message: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}
