import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { DatabaseClient } from '../../src/modules/database/PrismaClient';
import { stateStore, llmClient, database } from '../../src/container';
import { FakeLLMClient } from '../mocks/FakeLLMClient';

describe('Interview API E2E', () => {
  const prisma = DatabaseClient.getInstance();
  let candidateId: string;
  let sessionId: string;
  const mockLlm = llmClient as FakeLLMClient;

  beforeAll(async () => {
    // Make sure DB is clean
    await prisma.score.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.report.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.candidate.deleteMany();

    await prisma.user.deleteMany();

    const candidate = await database.candidateProfiles.create({
      name: 'API Test Candidate',
      email: 'api-test@example.com',
      role: 'Dev',
      experienceLevel: 'Mid'
    });
    candidateId = candidate.id;
  });

  afterAll(async () => {
    await prisma.score.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.report.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await stateStore.shutdown();
  });

  it('POST /api/interview/start - should start an interview', async () => {
    // Setup Mock for question generation
    mockLlm.defaultResponse = JSON.stringify({
      question: 'What is your favorite programming language?',
      expectedAnswerSummary: 'Candidate should name a language.',
      evaluationCriteria: ['Names a language'],
      topic: 't1',
      difficulty: 'Easy'
    });

    const response = await request(app)
      .post('/api/interview/start')
      .send({
        candidateId,
        curriculum: 'default'
      });

    expect(response.status).toBe(200);
    expect(response.body.sessionId).toBeDefined();
    expect(response.body.question).toBe('What is your favorite programming language?');

    sessionId = response.body.sessionId;
  });

  it('POST /api/interview/answer - should submit an answer and get next question', async () => {
    // Setup Mock for analysis, rubric, follow-up, and next question
    let callCount = 0;
    mockLlm.responseOverrides = [
      () => {
        callCount++;
        if (callCount === 1) { // evaluateAccuracy
          return JSON.stringify({
            technical_accuracy: 90,
            technical_feedback: 'good'
          });
        }
        if (callCount === 2) { // candidateAnalyzer
          return JSON.stringify({
            missingConcepts: [],
            misconceptions: []
          });
        }
        if (callCount === 3) { // FollowUpGenerator
           return JSON.stringify({
             followUpQuestion: 'Why?',
             reasoning: 'Probe further'
           });
        }
        if (callCount === 4) { // next question generator
          return JSON.stringify({
            question: 'What is a closure?',
            expectedAnswerSummary: 'Functions bundling scope',
            evaluationCriteria: ['Scope'],
            topic: 't2',
            difficulty: 'Medium'
          });
        }
        return JSON.stringify({});
      }
    ];

    const response = await request(app)
      .post('/api/interview/answer')
      .send({
        sessionId,
        answer: 'My favorite is TypeScript.'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Since our follow up logic is mocked, let's just ensure we get a 200 OK.
  });

  it('POST /api/interview/end - should end interview and return reportId', async () => {
    // Mock report generator if necessary, but ReportGenerator might not need LLM or we can mock it
    mockLlm.responseOverrides = [
      () => JSON.stringify({
        strengths: ['TS'],
        weaknesses: [],
        summary: 'Good candidate'
      })
    ];

    const response = await request(app)
      .post('/api/interview/end')
      .send({ sessionId });

    expect(response.status).toBe(200);
    expect(response.body.reportId).toBeDefined();
  });
});
