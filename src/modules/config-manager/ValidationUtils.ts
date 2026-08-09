import { IAppConfiguration } from './ConfigTypes';

export class ValidationUtils {
  public static validateConfig(config: IAppConfiguration): void {
    const errors: string[] = [];

    if (!config.auth.jwtSecret || config.auth.jwtSecret === 'default-secret-key-for-dev') {
      if (config.app.env === 'production') {
        errors.push('JWT Secret is required and cannot be default in production');
      }
    }

    if (!config.models.apiKey && config.app.env !== 'test' && config.app.env !== 'development') {
      errors.push('AI Model API Key is required');
    }

    if (config.app.env === 'production' && !config.database.url) {
      errors.push('Database URL is required in production');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration Validation Failed:\n- ${errors.join('\n- ')}`);
    }
  }
}
