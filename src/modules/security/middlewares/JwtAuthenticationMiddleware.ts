import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';
import { AuthenticationException } from '../../error-handler/AppExceptions';

export class JwtAuthenticationMiddleware {
  constructor(private jwtService: JwtService) {}

  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AuthenticationException('Missing or invalid Authorization header'));
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = this.jwtService.verify(token);
      (req as any).user = payload;
      next();
    } catch (error: any) {
      next(new AuthenticationException(error.message === 'TokenExpired' ? 'Token expired' : 'Invalid token'));
    }
  }
}
