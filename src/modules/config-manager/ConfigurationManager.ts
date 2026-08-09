import { IAppConfiguration, Environment } from './ConfigTypes';
import { EnvironmentLoader } from './EnvironmentLoader';
import { ValidationUtils } from './ValidationUtils';
import { FeatureFlagManager } from './FeatureFlagManager';

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private readonly config: IAppConfiguration;
  public readonly features: FeatureFlagManager;

  private constructor() {
    const envLoader = new EnvironmentLoader();
    envLoader.load();
    
    const env = (envLoader.get('NODE_ENV', 'development') as Environment);

    this.config = {
      app: {
        name: envLoader.get('APP_NAME', 'AI Interview Agent'),
        env,
        port: envLoader.getNumber('PORT', 3000),
        host: envLoader.get('HOST', '0.0.0.0'),
        corsOrigins: envLoader.get('CORS_ORIGINS', '*').split(','),
      },
      models: {
        provider: envLoader.get('MODEL_PROVIDER', 'openrouter'),
        defaultModel: envLoader.get('DEFAULT_MODEL', 'anthropic/claude-3-5-sonnet'),
        apiKey: envLoader.get('AI_API_KEY', envLoader.get('OPENROUTER_API_KEY', '')),
        maxTokens: envLoader.getNumber('MODEL_MAX_TOKENS', 2048),
        temperature: envLoader.getNumber('MODEL_TEMPERATURE', 0.7),
        timeoutMs: envLoader.getNumber('MODEL_TIMEOUT_MS', 30000),
        fallbackModels: envLoader.get('FALLBACK_MODELS', 'openai/gpt-4o').split(','),
      },
      database: {
        url: envLoader.get('DATABASE_URL', ''),
        host: envLoader.get('DB_HOST', 'localhost'),
        port: envLoader.getNumber('DB_PORT', 5432),
        ssl: envLoader.getBoolean('DB_SSL', false),
        poolSize: envLoader.getNumber('DB_POOL_SIZE', 10),
      },
      auth: {
        jwtSecret: envLoader.get('JWT_SECRET', 'default-secret-key-for-dev'),
        jwtExpiresIn: envLoader.get('JWT_EXPIRES_IN', '1h'),
        bcryptSaltRounds: envLoader.getNumber('BCRYPT_SALT_ROUNDS', 10),
      },
      logging: {
        level: envLoader.get('LOG_LEVEL', 'info'),
        format: envLoader.get('LOG_FORMAT', 'json') as 'json' | 'text',
        enableConsole: envLoader.getBoolean('LOG_ENABLE_CONSOLE', true),
        enableFile: envLoader.getBoolean('LOG_ENABLE_FILE', false),
      },
      monitoring: {
        enabled: envLoader.getBoolean('MONITORING_ENABLED', false),
        sentryDsn: envLoader.get('SENTRY_DSN', ''),
      },
      features: {
        enableAudioAnalysis: envLoader.getBoolean('FF_AUDIO_ANALYSIS', false),
        enableVideoAnalysis: envLoader.getBoolean('FF_VIDEO_ANALYSIS', false),
        enableRealtimeSync: envLoader.getBoolean('FF_REALTIME_SYNC', true),
        enablePdfExport: envLoader.getBoolean('FF_PDF_EXPORT', true),
      }
    };

    ValidationUtils.validateConfig(this.config);
    this.features = new FeatureFlagManager(this.config.features);
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public getConfig(): IAppConfiguration {
    return this.config;
  }
}
