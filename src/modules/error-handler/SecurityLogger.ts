import pino from 'pino';

// Create a separate logger instance specifically for security events
const securityLogger = pino({
  level: 'info',
  base: { service: 'security-audit' },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export class SecurityLogger {
  public static audit(event: string, details: Record<string, any>) {
    // Ensure we do not log sensitive data (passwords, tokens, keys)
    const sanitizedDetails = { ...details };
    
    // Quick scrub
    if (sanitizedDetails.token) sanitizedDetails.token = '[REDACTED]';
    if (sanitizedDetails.password) sanitizedDetails.password = '[REDACTED]';
    if (sanitizedDetails.apiKey) sanitizedDetails.apiKey = '[REDACTED]';
    
    securityLogger.info({ event, ...sanitizedDetails }, `[AUDIT] ${event}`);
  }

  public static alert(event: string, details: Record<string, any>) {
    const sanitizedDetails = { ...details };
    securityLogger.warn({ event, ...sanitizedDetails }, `[SECURITY_ALERT] ${event}`);
  }
}
