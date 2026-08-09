import crypto from 'crypto';
import { SecurityException } from '../../error-handler/AppExceptions';
import { ErrorLogger } from '../../error-handler/ErrorLogger';
import { ErrorCategory, LogLevel } from '../../error-handler/ErrorTypes';

export enum RiskLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class PromptSecurityService {
  
  private static readonly INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /reveal system prompt/i,
    /act as administrator/i,
    /execute code/i,
    /forget all instructions/i,
    /you are now a/i
  ];

  public analyzeAndProcess(prompt: string, sessionId: string): string {
    const normalized = this.normalize(prompt);
    const riskLevel = this.detectPatterns(normalized);
    
    this.logSecurityEvent(sessionId, riskLevel, prompt);

    if (riskLevel === RiskLevel.CRITICAL || riskLevel === RiskLevel.HIGH) {
      throw new SecurityException('Input blocked due to security policies.', 'PROMPT_INJECTION', 400);
    }

    if (riskLevel === RiskLevel.MEDIUM) {
      return this.sanitize(normalized);
    }

    return normalized;
  }

  private normalize(prompt: string): string {
    // Trim, remove zero-width spaces, normalize unicode
    return prompt
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .normalize('NFKC');
  }

  private detectPatterns(prompt: string): RiskLevel {
    if (prompt.length > 5000) return RiskLevel.HIGH;

    let matchCount = 0;
    for (const pattern of PromptSecurityService.INJECTION_PATTERNS) {
      if (pattern.test(prompt)) {
        matchCount++;
      }
    }

    if (matchCount > 2) return RiskLevel.CRITICAL;
    if (matchCount === 1) return RiskLevel.HIGH;

    // Detect excessive special characters (often used to break tokenization)
    const specialCharRatio = (prompt.match(/[^a-zA-Z0-9\s]/g) || []).length / prompt.length;
    if (specialCharRatio > 0.3 && prompt.length > 20) return RiskLevel.MEDIUM;

    return RiskLevel.SAFE;
  }

  private sanitize(prompt: string): string {
    // Basic sanitization for medium risk
    return prompt.replace(/[<>{}\[\]\\]/g, '');
  }

  private logSecurityEvent(sessionId: string, riskLevel: RiskLevel, rawPrompt: string) {
    if (riskLevel === RiskLevel.SAFE) return;

    const hash = crypto.createHash('sha256').update(rawPrompt).digest('hex');
    
    // Log without the raw prompt
    ErrorLogger.log({
      level: riskLevel === RiskLevel.CRITICAL ? LogLevel.ERROR : LogLevel.WARNING,
      category: ErrorCategory.SECURITY,
      code: 'PROMPT_RISK_DETECTED',
      message: `Prompt risk detected: ${riskLevel}`,
      timestamp: new Date().toISOString(),
      details: {
        sessionId,
        riskLevel,
        promptHash: hash
      }
    });
  }
}
