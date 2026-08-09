import { Router, Request, Response, NextFunction } from 'express';
import { interviewEngine } from '../container';
import { ErrorLogger } from '../modules/error-handler';
import { LogLevel, ErrorCategory } from '../modules/error-handler/ErrorTypes';
import { stateStore } from '../container';
import { validateRequest } from '../modules/validation/ValidationMiddleware';
import { StartInterviewSchema, SubmitAnswerSchema, EndInterviewSchema } from '../modules/validation/schemas';
import { rateLimiterFactory, apiKeyMiddleware, jwtAuthMiddleware } from '../container';
import { AuthorizationMiddleware } from '../modules/security/middlewares/AuthorizationMiddleware';

const router = Router();

// Endpoint-specific rate limiting
router.post('/start', rateLimiterFactory.startLimiter, validateRequest(StartInterviewSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { candidateId, curriculum } = req.body;
    ErrorLogger.log({
      level: LogLevel.INFO,
      category: ErrorCategory.INTERNAL,
      message: `Interview started for candidate ${candidateId} on ${curriculum}`,
      code: 'INT_START',
      timestamp: new Date().toISOString()
    });
    const sessionId = await interviewEngine.startInterview(candidateId, curriculum);
    const state = await stateStore.getSessionState(sessionId);
    const firstQuestion = state?.currentQuestion || "Let's begin.";
    
    res.status(200).json({
      sessionId,
      question: firstQuestion
    });
  } catch (error: any) {
    next(error);
  }
});

router.post('/answer', rateLimiterFactory.answerLimiter, validateRequest(SubmitAnswerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, answer, timeTakenMs, confidenceScore } = req.body;
    ErrorLogger.log({
      level: LogLevel.INFO,
      category: ErrorCategory.INTERNAL,
      message: `Answer received for session ${sessionId}`,
      code: 'INT_ANSWER',
      timestamp: new Date().toISOString()
    });
    
    // submitAnswer now awaits the full LLM pipeline and returns the settled result,
    // so we no longer need to read state from Redis afterwards (which was the race condition).
    const result = await interviewEngine.submitAnswer(sessionId, answer, { timeTakenMs, confidenceScore });
    
    ErrorLogger.log({
      level: LogLevel.INFO,
      category: ErrorCategory.INTERNAL,
      message: `Score generated for session ${sessionId}`,
      code: 'INT_SCORE',
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      nextQuestion: result.nextQuestion,
      completed: result.completed,
      reasoning: result.reasoning,
      difficulty: result.difficulty,
      timedOut: result.timedOut ?? false,
      score: result.score ?? null,
      topic: result.topic ?? null,
    });
  } catch (error: any) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ status: 'in_progress', sessionId: req.params.id });
});

router.post('/end', rateLimiterFactory.endLimiter, validateRequest(EndInterviewSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.body;
    ErrorLogger.log({
      level: LogLevel.INFO,
      category: ErrorCategory.INTERNAL,
      message: `Ending interview for session ${sessionId}`,
      code: 'INT_END',
      timestamp: new Date().toISOString()
    });
    
    const reportId = await interviewEngine.endInterview(sessionId);
    
    res.status(200).json({ summary: 'Interview ended successfully.', reportId });
  } catch (error: any) {
    next(error);
  }
});

export default router;
