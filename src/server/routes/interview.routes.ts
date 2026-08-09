import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { InterviewApiService } from '../services/interviewApi.service';

export const createInterviewRouter = (): Router => {
  const router = Router();
  
  const interviewService = new InterviewApiService();
  const interviewController = new InterviewController(interviewService);

  router.post('/start', interviewController.start);
  router.post('/:sessionId/next', interviewController.next);
  router.post('/:sessionId/answer', interviewController.answer);
  router.post('/:sessionId/end', interviewController.end);

  return router;
};
