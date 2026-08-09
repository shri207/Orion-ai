import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.string().url('Invalid DATABASE_URL format'),
  REDIS_URL: z.string().url('Invalid REDIS_URL format'),
  
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  
  API_KEYS: z.string().min(1, 'API_KEYS must not be empty').transform(keys => keys.split(',').map(k => k.trim())),
  
  OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY is required for the LLM client'),
  
  ALLOWED_ORIGINS: z.string().default('*').transform(origins => origins.split(',').map(o => o.trim())),
  
  TOPIC_SELECTOR_ADAPTIVE_STRATEGY: z.enum(['BALANCED', 'WEAKNESS_FIRST', 'BREADTH_FIRST', 'DEPTH_FIRST', 'CHALLENGE_MODE']).default('BALANCED'),
  TOPIC_SELECTOR_DIFFICULTY_ESCALATION_THRESHOLD: z.string().transform(Number).default('3'),
  TOPIC_SELECTOR_DIFFICULTY_DEESCALATION_THRESHOLD: z.string().transform(Number).default('2'),
  TOPIC_SELECTOR_WEAK_TOPIC_THRESHOLD: z.string().transform(Number).default('60'),
  TOPIC_SELECTOR_CRITICAL_TOPIC_THRESHOLD: z.string().transform(Number).default('40'),
  TOPIC_SELECTOR_MAX_FOLLOW_UP_DEPTH: z.string().transform(Number).default('3'),
  TOPIC_SELECTOR_REVIEW_COMPLETED_TOPICS: z.string().transform(s => s === 'true').default('false'),
  TOPIC_SELECTOR_MIN_COVERAGE_BEFORE_ESCALATION: z.string().transform(Number).default('2'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validateEnv() {
  const parsed = EnvSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment configuration:', parsed.error.format());
    process.exit(1);
  }
  
  return parsed.data;
}
