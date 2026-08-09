import { IJwtService, IAuthUser, IJwtPayload } from './AuthTypes';
import * as crypto from 'crypto';

export class JwtService implements IJwtService {
  constructor(
    private readonly secret: string = process.env.JWT_SECRET || 'default-secret-key-for-dev',
    private readonly expiresInMs: number = 3600 * 1000 
  ) {}

  private base64UrlEncode(str: string): string {
    return Buffer.from(str).toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  public generateToken(user: IAuthUser): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + Math.floor(this.expiresInMs / 1000)
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto.createHmac('sha256', this.secret)
      .update(signatureInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${signatureInput}.${signature}`;
  }

  public verifyToken(token: string): IJwtPayload {
    if (!token) {
      throw new Error('Token is required');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    const expectedSignature = crypto.createHmac('sha256', this.secret)
      .update(signatureInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf8')) as IJwtPayload;
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }

    return payload;
  }
}
