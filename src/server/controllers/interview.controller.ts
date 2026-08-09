import { Request, Response } from 'express';
import { IInterviewApiService } from '../services/interviewApi.service';

export class InterviewController {
  constructor(private readonly interviewService: IInterviewApiService) {}

  public start = async (req: Request, res: Response): Promise<void> => {
    try {
      const { candidateId, role, difficulty, interviewType } = req.body;
      
      if (!candidateId || !role || !difficulty || !interviewType) {
        res.status(400).json({ error: 'Missing required fields: candidateId, role, difficulty, interviewType' });
        return;
      }

      const result = await this.interviewService.startInterview({ candidateId, role, difficulty, interviewType });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  public next = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        res.status(400).json({ error: 'Missing sessionId' });
        return;
      }

      const result = await this.interviewService.getNextQuestion(sessionId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Session not found') {
        res.status(404).json({ error: 'Session not found' });
      } else {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  };

  public answer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { answer, timestamp, audioMetadata } = req.body;

      if (!sessionId) {
        res.status(400).json({ error: 'Missing sessionId' });
        return;
      }
      
      if (!answer) {
        res.status(400).json({ error: 'Missing answer' });
        return;
      }

      const result = await this.interviewService.submitAnswer(sessionId, { answer, timestamp, audioMetadata });
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Session not found') {
        res.status(404).json({ error: 'Session not found' });
      } else {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  };

  public end = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        res.status(400).json({ error: 'Missing sessionId' });
        return;
      }

      const result = await this.interviewService.endInterview(sessionId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Session not found') {
        res.status(404).json({ error: 'Session not found' });
      } else {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  };
}
