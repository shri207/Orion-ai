import dotenv from 'dotenv';

dotenv.config();

interface Env {
  PORT: number;
  NODE_ENV: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
  OPENROUTER_BASE_URL: string;
  OPENROUTER_TIMEOUT: number;
  QUESTION_TEMPERATURE: number;
  MAX_FOLLOWUPS_PER_TOPIC: number;
  MAX_FOLLOWUPS_PER_INTERVIEW: number;
}

export const env: Env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  OPENROUTER_TIMEOUT: process.env.OPENROUTER_TIMEOUT ? parseInt(process.env.OPENROUTER_TIMEOUT, 10) : 10000,
  QUESTION_TEMPERATURE: process.env.QUESTION_TEMPERATURE ? parseFloat(process.env.QUESTION_TEMPERATURE) : 0.7,
  MAX_FOLLOWUPS_PER_TOPIC: process.env.MAX_FOLLOWUPS_PER_TOPIC ? parseInt(process.env.MAX_FOLLOWUPS_PER_TOPIC, 10) : 3,
  MAX_FOLLOWUPS_PER_INTERVIEW: process.env.MAX_FOLLOWUPS_PER_INTERVIEW ? parseInt(process.env.MAX_FOLLOWUPS_PER_INTERVIEW, 10) : 10,
};
