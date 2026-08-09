export default async function teardown() {
  const pgContainer = (global as any).__PG_CONTAINER__;
  const redisContainer = (global as any).__REDIS_CONTAINER__;

  if (pgContainer) {
    console.log('Stopping Postgres Testcontainer...');
    await pgContainer.stop();
  }

  if (redisContainer) {
    console.log('Stopping Redis Testcontainer...');
    await redisContainer.stop();
  }
}
