import { BaseAppException } from './AppExceptions';
import { IErrorResponse, IErrorLogPayload, ErrorCategory, LogLevel } from './ErrorTypes';
import { ConfigurationManager } from '../config-manager';

export class ErrorFormatter {
  public static formatForUser(error: Error, requestId?: string): IErrorResponse {
    const config = ConfigurationManager.getInstance().getConfig();
    const isDebug = config.app.env === 'development';

    if (error instanceof BaseAppException) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: (error.isOperational || isDebug) ? error.details : undefined,
          requestId,
          timestamp: new Date().toISOString()
        }
      } as any;
    }

    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
        details: isDebug ? { originalError: error.message, stack: error.stack } : undefined,
        requestId,
        timestamp: new Date().toISOString()
      }
    } as any;
  }

  public static formatForLog(error: Error, requestId?: string): IErrorLogPayload {
    const isAppException = error instanceof BaseAppException;
    
    return {
      level: isAppException ? error.level : LogLevel.CRITICAL,
      category: isAppException ? error.category : ErrorCategory.INTERNAL,
      message: error.message,
      code: isAppException ? error.code : 'UNHANDLED_EXCEPTION',
      stack: error.stack,
      details: isAppException ? error.details : undefined,
      requestId,
      timestamp: new Date().toISOString()
    };
  }
}
