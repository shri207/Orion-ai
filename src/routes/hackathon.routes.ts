/**
 * Hackathon / Developer API Sandbox
 * ------------------------------------
 * Exposes `POST /api/interview` as a single unauthenticated endpoint.
 * Accepts two payload shapes:
 *   1. { type: "candidate", candidateId, curriculum } → starts an interview session
 *   2. { type: "message",   sessionId, message }      → submits an answer
 *
 * Registered in app.ts BEFORE the JWT middleware so no authentication is required.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { interviewEngine, stateStore } from '../container';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Record<string, any>;

    // ── Type 1: Start Interview ────────────────────────────────────────────
    if (body.type === 'candidate') {
      const { candidateId, curriculum } = body;

      if (!candidateId || !curriculum) {
        return res.status(400).json({
          error: 'Missing required fields: candidateId, curriculum',
          example: { type: 'candidate', candidateId: 'CAND-001', curriculum: 'ai-engineering' }
        });
      }

      const sessionId = await interviewEngine.startInterview(candidateId, curriculum);
      const state = await stateStore.getSessionState(sessionId);
      const firstQuestion = state?.currentQuestion ?? "Let's begin. Tell me about yourself.";

      return res.status(200).json({
        sessionId,
        question: firstQuestion,
        topic: state?.currentTopic ?? null,
        difficulty: state?.difficulty ?? 'medium',
        timeLimit: 120,                 // seconds — enforced server-side
        maxFollowUps: 2,                // follow-up cap per topic
      });
    }

    // ── Type 2: Submit Answer ──────────────────────────────────────────────
    if (body.type === 'message') {
      const { sessionId, message, timeTakenMs } = body;

      if (!sessionId || !message) {
        return res.status(400).json({
          error: 'Missing required fields: sessionId, message',
          example: { type: 'message', sessionId: '<uuid>', message: 'My answer…' }
        });
      }

      const result = await interviewEngine.submitAnswer(sessionId, message, { timeTakenMs });

      if (result.completed) {
        return res.status(200).json({
          completed: true,
          message: 'Interview completed. Retrieve the report via GET /api/report/:reportId'
        });
      }

      return res.status(200).json({
        completed: false,
        nextQuestion: result.nextQuestion,
        timedOut: result.timedOut ?? false,
        difficulty: result.difficulty,
      });
    }

    // ── Unknown type ──────────────────────────────────────────────────────
    return res.status(400).json({
      error: `Unknown payload type: "${body.type}". Expected "candidate" or "message".`,
      supportedTypes: ['candidate', 'message']
    });

  } catch (error: any) {
    next(error);
  }
});

export default router;
