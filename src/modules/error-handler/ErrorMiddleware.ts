import { Request, Response, NextFunction } from 'express';
import { BaseAppException } from './AppExceptions';
import { ErrorFormatter } from './ErrorFormatter';
import { ErrorLogger } from './ErrorLogger';

import { SecurityLogger } from './SecurityLogger';
import { SecurityException } from './AppExceptions';

export class ErrorMiddleware {
  public static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || undefined;
    
    const logPayload = ErrorFormatter.formatForLog(err, requestId);
    ErrorLogger.log(logPayload);

    if (err instanceof SecurityException || logPayload.category === 'SECURITY') {
      SecurityLogger.alert('Security violation detected', {
        error: err.message,
        requestId,
        ip: req.ip,
        url: req.originalUrl
      });
    }
    
    const response = ErrorFormatter.formatForUser(err, requestId);
    
    const statusCode = err instanceof BaseAppException ? err.statusCode : 500;
    
    res.status(statusCode).json(response);
  }
  
  public static handleNotFound(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found`
      }
    });
  }
}
