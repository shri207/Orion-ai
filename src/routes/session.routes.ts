import { Router, Request, Response, NextFunction } from 'express';
import { database } from '../container';

const router = Router();

/**
 * GET /api/sessions
 * Returns a list of recent interview sessions for the History page.
 * Query params:
 *   ?limit=20  (default 20, max 100)
 *   ?offset=0  (pagination offset)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const status = req.query.status as string | undefined;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const all      = await database.interviewSessions.findAll(filter);
    const sessions = all.slice(offset, offset + limit);

    const shaped = (sessions ?? []).map((s: any) => ({
      sessionId:     s.id,
      candidateId:   s.candidateId,
      candidateName: s.metadata?.candidateName ?? 'Candidate',
      curriculum:    s.metadata?.curriculum    ?? 'General',
      status:        s.status,
      score:         s.metadata?.overallScore  ?? null,
      startTime:     s.startTime,
      duration:      s.metadata?.durationSeconds ?? null,
      reportId:      s.metadata?.reportId       ?? null,
    }));

    return res.status(200).json({
      sessions: shaped,
      total:    all.length,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions/:sessionId
 * Returns detail for a single session.
 */
router.get('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const session = await database.interviewSessions.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found', sessionId });
    }

    return res.status(200).json({
      sessionId:     session.id,
      candidateId:   session.candidateId,
      candidateName: (session as any).metadata?.candidateName ?? 'Candidate',
      curriculum:    (session as any).metadata?.curriculum    ?? 'General',
      status:        session.status,
      score:         (session as any).metadata?.overallScore  ?? null,
      startTime:     (session as any).startTime,
      reportId:      (session as any).metadata?.reportId      ?? null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
