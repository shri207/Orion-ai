import { Request, Response, NextFunction } from 'express';
import { IApiKeyRepository } from '../repositories/IApiKeyRepository';
import { AuthenticationException } from '../../error-handler/AppExceptions';

export class ApiKeyMiddleware {
  constructor(private apiKeyRepository: IApiKeyRepository) {}

  public handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return next(new AuthenticationException('Missing x-api-key header'));
    }

    try {
      const record = await this.apiKeyRepository.findByKey(apiKey);
      
      if (!record) {
        return next(new AuthenticationException('Invalid API Key'));
      }
      
      (req as any).apiClient = record.clientId;
      next();
    } catch (error) {
      next(new AuthenticationException('Error verifying API Key'));
    }
  }
}
