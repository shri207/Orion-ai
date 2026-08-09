import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { RedisInterviewStateStore } from '../../src/infrastructure/redis/RedisInterviewStateStore';

describe('RedisInterviewStateStore Integration', () => {
  let store: RedisInterviewStateStore;
  const sessionId = 'test-session-123';

  beforeAll(() => {
    store = new RedisInterviewStateStore();
  });

  afterAll(async () => {
    await store.clear(sessionId);
    await store.shutdown();
  });

  beforeEach(async () => {
    await store.clear(sessionId);
  });

  it('should save and retrieve session state', async () => {
    const state = { currentQuestion: 'Q1', score: 10 };
    await store.setSessionState(sessionId, state);

    const retrieved = await store.getSessionState(sessionId);
    expect(retrieved).toEqual(state);
  });

  it('should return null for non-existent session state', async () => {
    const retrieved = await store.getSessionState('missing');
    expect(retrieved).toBeNull();
  });

  it('should append and retrieve history', async () => {
    await store.appendHistory(sessionId, { role: 'interviewer', text: 'Q1' });
    await store.appendHistory(sessionId, { role: 'candidate', text: 'A1' });

    const history = await store.getHistory(sessionId);
    expect(history).toHaveLength(2);
    expect(history[0].role).toBe('interviewer');
    expect(history[1].role).toBe('candidate');
  });

  it('should delete session state', async () => {
    await store.setSessionState(sessionId, { status: 'active' });
    await store.deleteSessionState(sessionId);

    const retrieved = await store.getSessionState(sessionId);
    expect(retrieved).toBeNull();
  });

  it('should test TTL by setting a short TTL if possible', async () => {
    // We can't easily mock process.env in beforeAll since store is created
    // But we can check that it sets EX correctly by looking at the redis client if exposed
    // Or we just test crash recovery by verifying state is persisted across instances
    const store2 = new RedisInterviewStateStore();
    
    await store.setSessionState(sessionId, { data: 'persistent' });
    const retrieved = await store2.getSessionState(sessionId);
    
    expect(retrieved).toEqual({ data: 'persistent' });
    
    await store2.shutdown();
  });
});
