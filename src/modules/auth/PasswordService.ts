import { IPasswordService } from './AuthTypes';
import * as crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);
const randomBytes = promisify(crypto.randomBytes);

export class PasswordService implements IPasswordService {
  public async hashPassword(password: string): Promise<string> {
    const salt = (await randomBytes(16)).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!hash || !hash.includes(':')) {
      return false;
    }
    
    const [salt, key] = hash.split(':');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  }
}
