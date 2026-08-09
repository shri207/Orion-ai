import { Request, Response, NextFunction } from 'express';
import { AuthorizationException } from '../../error-handler/AppExceptions';

export class AuthorizationMiddleware {
  public static requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;
      
      if (!user) {
        return next(new AuthorizationException('Identity not found. Authentication required.'));
      }
      
      if (!user.roles || !roles.some(r => user.roles.includes(r))) {
        return next(new AuthorizationException(`Required role not found. Allowed roles: ${roles.join(', ')}`));
      }
      
      next();
    };
  }
}
