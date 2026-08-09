import { IErrorLogPayload, LogLevel } from './ErrorTypes';
import { ConfigurationManager } from '../config-manager';

export class ErrorLogger {
  public static log(payload: IErrorLogPayload): void {
    const config = ConfigurationManager.getInstance().getConfig();
    
    const logString = config.logging.format === 'json' 
      ? JSON.stringify(payload)
      : `[${payload.timestamp}] [${payload.level}] [${payload.category}] [${payload.code}] ${payload.message} ${payload.requestId ? `(ReqID: ${payload.requestId})` : ''}`;

    if (config.logging.enableConsole) {
      switch (payload.level) {
        case LogLevel.INFO:
          console.info(logString);
          break;
        case LogLevel.WARNING:
          console.warn(logString);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(logString);
          if (payload.stack && config.app.env === 'development') {
            console.error(payload.stack);
          }
          break;
      }
    }
  }
}
