import { Request, Response, NextFunction } from 'express';
import { IAuthService } from './AuthTypes';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly authService: IAuthService) {}

  public authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication token missing or malformed' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const payload = this.authService.validateSession(token);
      
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
      
      next();
    } catch (error: any) {
      if (error.message === 'Token has expired') {
        res.status(401).json({ error: 'Token has expired' });
      } else {
        res.status(401).json({ error: 'Invalid authentication token' });
      }
    }
  };

  public requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        return;
      }
      
      next();
    };
  };
}
