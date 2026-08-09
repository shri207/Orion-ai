import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IInterviewReportRepository, IInterviewSessionRepository, ICandidateProfileRepository } from '../../src/modules/database/DatabaseTypes';
import { InterviewReportRepository } from '../../src/modules/database/repositories/InterviewReportRepository';
import { InterviewSessionRepository } from '../../src/modules/database/repositories/InterviewSessionRepository';
import { CandidateProfileRepository } from '../../src/modules/database/repositories/CandidateProfileRepository';
import { DatabaseClient } from '../../src/modules/database/PrismaClient';

export function runReportRepositoryContractTests(
  getRepository: () => IInterviewReportRepository,
  getSessionRepository: () => IInterviewSessionRepository,
  getCandidateRepository: () => ICandidateProfileRepository,
  setup: () => Promise<void>,
  teardown: () => Promise<void>
) {
  describe('IInterviewReportRepository Contract', () => {
    let repo: IInterviewReportRepository;
    let sessionRepo: IInterviewSessionRepository;
    let candidateRepo: ICandidateProfileRepository;
    let interviewId: string;

    beforeEach(async () => {
      await setup();
      repo = getRepository();
      sessionRepo = getSessionRepository();
      candidateRepo = getCandidateRepository();

      const candidate = await candidateRepo.create({
        name: 'Test',
        email: `test-${Date.now()}@example.com`,
        role: 'Dev',
        experienceLevel: 'Mid'
      });

      const session = await sessionRepo.create({
        candidateId: candidate.id,
        status: 'completed',
        metadata: {}
      });
      interviewId = session.id;
    });

    afterEach(async () => {
      await teardown();
    });

    it('should create and find a report by id', async () => {
      const created = await repo.create({
        interviewId,
        overallScore: 85,
        reportData: { strengths: ['React'] }
      });

      expect(created.id).toBeDefined();
      expect(created.interviewId).toBe(interviewId);
      expect(created.overallScore).toBe(85);

      const found = await repo.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.overallScore).toBe(85);
      expect(found?.reportData).toEqual({
        summary: '',
        strengths: ['React'],
        weaknesses: [],
        recommendations: []
      });
    });

    it('should find a report by interviewId', async () => {
      await repo.create({
        interviewId,
        overallScore: 85,
        reportData: { strengths: ['React'] }
      });

      const found = await repo.findByInterviewId(interviewId);
      expect(found).not.toBeNull();
      expect(found?.interviewId).toBe(interviewId);
    });

    it('should update a report', async () => {
      const created = await repo.create({
        interviewId,
        overallScore: 85,
        reportData: { strengths: ['React'] }
      });

      const updated = await repo.update(created.id, { overallScore: 90 });
      expect(updated).not.toBeNull();
      expect(updated?.overallScore).toBe(90);

      const found = await repo.findById(created.id);
      expect(found?.overallScore).toBe(90);
    });

    it('should delete a report', async () => {
      const created = await repo.create({
        interviewId,
        overallScore: 85,
        reportData: { strengths: ['React'] }
      });

      const deleted = await repo.delete(created.id);
      expect(deleted).toBe(true);

      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });
  });
}

describe('PrismaInterviewReportRepository', () => {
  const prisma = DatabaseClient.getInstance();

  runReportRepositoryContractTests(
    () => new InterviewReportRepository(),
    () => new InterviewSessionRepository(),
    () => new CandidateProfileRepository(),
    async () => {
      await prisma.score.deleteMany();
      await prisma.answer.deleteMany();
      await prisma.question.deleteMany();
      await prisma.report.deleteMany();
      await prisma.interview.deleteMany();
      await prisma.candidate.deleteMany();
    },
    async () => {
      await prisma.score.deleteMany();
      await prisma.answer.deleteMany();
      await prisma.question.deleteMany();
      await prisma.report.deleteMany();
      await prisma.interview.deleteMany();
      await prisma.candidate.deleteMany();
    }
  );
});
