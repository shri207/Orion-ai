import { Request, Response, NextFunction } from 'express';
import { MetricsRegistry } from './MetricsRegistry';
import { ErrorCategory, LogLevel } from '../error-handler/ErrorTypes';
import { ErrorLogger } from '../error-handler/ErrorLogger';
import { ConfigurationManager } from '../config-manager';

export class RequestMonitoringMiddleware {
  public static monitor = (req: Request, res: Response, next: NextFunction): void => {
    const config = ConfigurationManager.getInstance().getConfig();
    if (!config.monitoring.enabled) {
      return next();
    }

    const registry = MetricsRegistry.getInstance();
    const startTime = process.hrtime();
    const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
    req.headers['x-request-id'] = requestId;

    registry.incrementCounter('http_requests_total', 1, { method: req.method, path: req.path });
    registry.setGauge('http_requests_active', 1, { method: req.method });

    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const durationMs = (diff[0] * 1e3) + (diff[1] * 1e-6);

      registry.incrementCounter('http_requests_active', -1, { method: req.method });
      registry.recordHistogram('http_request_duration_ms', durationMs, { 
        method: req.method, 
        path: req.path,
        status: res.statusCode 
      });

      if (res.statusCode >= 400) {
        registry.incrementCounter('http_requests_errors_total', 1, { status: res.statusCode });
        
        if (res.statusCode >= 500) {
          ErrorLogger.log({
            level: LogLevel.ERROR,
            category: ErrorCategory.INTERNAL,
            message: `Slow or failed request detected on ${req.method} ${req.path}`,
            code: 'API_FAILURE',
            requestId,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    next();
  };
}
