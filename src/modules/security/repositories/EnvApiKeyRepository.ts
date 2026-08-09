import { IApiKeyRepository, ApiKeyRecord } from './IApiKeyRepository';
import { EnvConfig } from '../../config-manager/env.schema';
import crypto from 'crypto';

export class EnvApiKeyRepository implements IApiKeyRepository {
  private validKeys: string[];

  constructor(env: EnvConfig) {
    this.validKeys = env.API_KEYS;
  }

  public async findByKey(key: string): Promise<ApiKeyRecord | null> {
    const keyBuffer = Buffer.from(key);
    
    for (const validKey of this.validKeys) {
      const validKeyBuffer = Buffer.from(validKey);
      
      // Ensure buffers are the same length to avoid timing attacks
      if (keyBuffer.length === validKeyBuffer.length) {
        if (crypto.timingSafeEqual(keyBuffer, validKeyBuffer)) {
          return {
            key: validKey,
            clientId: 'env-client'
          };
        }
      }
    }
    
    return null;
  }
}
