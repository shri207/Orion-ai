import jwt from 'jsonwebtoken';
import { EnvConfig } from '../../config-manager/env.schema';

export interface JwtPayload {
  userId: string;
  roles?: string[];
  [key: string]: any;
}

export class JwtService {
  private secret: string;
  private expiresIn: string;

  constructor(env: EnvConfig) {
    this.secret = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
  }

  public sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
      algorithm: 'HS256'
    });
  }

  public verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TokenExpired');
      }
      throw new Error('InvalidToken');
    }
  }
}
