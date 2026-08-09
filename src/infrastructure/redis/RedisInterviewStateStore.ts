import { Redis } from 'ioredis';
import { IInterviewStateStore } from '../../modules/session/InterviewStateInterfaces';
import { ITopicState } from '../../modules/topic-selector/TopicSelectorTypes';

export class RedisInterviewStateStore implements IInterviewStateStore {
    private client: Redis;
    private readonly ttl: number;
    private readonly prefix = 'interview:';

    constructor() {
        this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            retryStrategy(times) {
                const delay = Math.min(times * 100, 2000); // Exponential backoff max 2 seconds
                return delay;
            }
        });
        this.ttl = parseInt(process.env.INTERVIEW_STATE_TTL_SECONDS || '86400', 10);
        
        this.client.on('error', (err) => {
            console.error('[Redis Error] Connection failure:', err);
        });
    }

    public getClient(): Redis {
        return this.client;
    }

    private getKey(sessionId: string, namespace: string): string {
        return `${this.prefix}${sessionId}:${namespace}`;
    }

    public async getTopicState(sessionId: string): Promise<ITopicState | null> {
        const data = await this.client.get(this.getKey(sessionId, 'topic'));
        return data ? JSON.parse(data) : null;
    }

    public async setTopicState(sessionId: string, state: ITopicState): Promise<void> {
        await this.client.set(this.getKey(sessionId, 'topic'), JSON.stringify(state), 'EX', this.ttl);
    }

    public async getHistory(sessionId: string): Promise<any[]> {
        const data = await this.client.lrange(this.getKey(sessionId, 'history'), 0, -1);
        return data.map(item => JSON.parse(item));
    }

    public async appendHistory(sessionId: string, entry: any): Promise<void> {
        const key = this.getKey(sessionId, 'history');
        const multi = this.client.multi();
        multi.rpush(key, JSON.stringify(entry));
        multi.expire(key, this.ttl);
        await multi.exec();
    }

    public async getSessionState(sessionId: string): Promise<any | null> {
        const data = await this.client.get(this.getKey(sessionId, 'state'));
        return data ? JSON.parse(data) : null;
    }

    public async setSessionState(sessionId: string, state: any): Promise<void> {
        await this.client.set(this.getKey(sessionId, 'state'), JSON.stringify(state), 'EX', this.ttl);
    }

    public async getCandidateState(sessionId: string): Promise<any | null> {
        const data = await this.client.get(this.getKey(sessionId, 'candidate'));
        return data ? JSON.parse(data) : null;
    }

    public async setCandidateState(sessionId: string, candidate: any): Promise<void> {
        await this.client.set(this.getKey(sessionId, 'candidate'), JSON.stringify(candidate), 'EX', this.ttl);
    }

    public async deleteSessionState(sessionId: string): Promise<void> {
        await this.client.del(this.getKey(sessionId, 'state'));
    }

    public async clear(sessionId: string): Promise<void> {
        await this.client.del(
            this.getKey(sessionId, 'topic'),
            this.getKey(sessionId, 'history'),
            this.getKey(sessionId, 'state'),
            this.getKey(sessionId, 'candidate')
        );
    }

    public async shutdown(): Promise<void> {
        await this.client.quit();
    }

    public async ping(): Promise<boolean> {
        try {
            const result = await this.client.ping();
            return result === 'PONG';
        } catch {
            return false;
        }
    }
}
