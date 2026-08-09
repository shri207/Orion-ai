import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { stateStore } from '../../container'; // Assuming the redis client can be accessed here
import { RateLimitException } from '../error-handler/AppExceptions';
import { Request, Response, NextFunction } from 'express';

// We need to pass the raw Redis client to rate-limit-redis
// stateStore in this project is RedisInterviewStateStore, we might need a way to get the redis client.
// Let's create a factory function that takes the redis client.

export class RateLimiterFactory {
  constructor(private redisClient: any) {}

  private createLimiter(max: number, windowMs: number) {
    return rateLimit({
      store: new RedisStore({
        sendCommand: (...args: string[]) => this.redisClient.call(...args),
      }),
      windowMs,
      max,
      handler: (req: Request, res: Response, next: NextFunction) => {
        next(new RateLimitException('Too many requests, please try again later.'));
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  public get authLimiter() {
    return this.createLimiter(10, 60 * 1000); // 10 per minute
  }

  public get startLimiter() {
    return this.createLimiter(20, 60 * 1000); // 20 per minute
  }

  public get answerLimiter() {
    return this.createLimiter(120, 60 * 1000); // 120 per minute
  }

  public get endLimiter() {
    return this.createLimiter(20, 60 * 1000); // 20 per minute
  }
}
