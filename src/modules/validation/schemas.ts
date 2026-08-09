import { z } from 'zod';

export const StartInterviewSchema = z.object({
  body: z.object({
    candidateId: z.string().min(1, 'Candidate ID is required'),
    curriculum: z.string().min(1, 'Curriculum is required')
  })
});

export const SubmitAnswerSchema = z.object({
  body: z.object({
    sessionId:       z.string().uuid('Invalid session ID format'),
    answer:          z.string().min(1, 'Answer must not be empty').max(10000, 'Answer is too long'),
    /** Time (ms) from question display to answer submission, sent by the client */
    timeTakenMs:     z.number().int().min(0).max(600_000).optional(),
    /** Optional pre-computed confidence score [0-100] from the LLM analysis */
    confidenceScore: z.number().min(0).max(100).optional(),
  })
});

export const EndInterviewSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid('Invalid session ID format')
  })
});
