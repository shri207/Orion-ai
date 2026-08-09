import { Router, Request, Response, NextFunction } from 'express';
import { jwtService } from '../container';

const router = Router();

/**
 * POST /api/auth/guest
 * Issues a 2-hour JWT for a guest user (no credentials required beyond API key).
 * The API key check is already applied by app.ts to all /api routes.
 */
router.post('/guest', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const token = jwtService.sign(
      { userId: `guest-${Date.now()}`, roles: ['guest'] }
    );
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
