import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

export default async function setup() {
  // Only start containers if we are running integration/api/contract tests
  // We can check process.env or vitest config if needed. But globalSetup runs globally.
  
  if (process.env.NO_DOCKER) {
    return;
  }

  console.log('Starting Testcontainers...');

  const pgContainer = await new PostgreSqlContainer('postgres:15').start();
  const redisContainer = await new RedisContainer('redis:7').start();

  process.env.DATABASE_URL = pgContainer.getConnectionUri() + '?schema=public';
  process.env.REDIS_URL = redisContainer.getConnectionUrl();

  // Store references for teardown
  (global as any).__PG_CONTAINER__ = pgContainer;
  (global as any).__REDIS_CONTAINER__ = redisContainer;
  
  console.log('Testcontainers started successfully.');
}
