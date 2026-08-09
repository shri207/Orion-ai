import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IInterviewSessionRepository, ICandidateProfileRepository } from '../../src/modules/database/DatabaseTypes';
import { InterviewSessionRepository } from '../../src/modules/database/repositories/InterviewSessionRepository';
import { CandidateProfileRepository } from '../../src/modules/database/repositories/CandidateProfileRepository';
import { DatabaseClient } from '../../src/modules/database/PrismaClient';

// A helper function that runs the contract tests against any implementation
export function runSessionRepositoryContractTests(
  getRepository: () => IInterviewSessionRepository,
  getCandidateRepository: () => ICandidateProfileRepository,
  setup: () => Promise<void>,
  teardown: () => Promise<void>
) {
  describe('IInterviewSessionRepository Contract', () => {
    let repo: IInterviewSessionRepository;
    let candidateRepo: ICandidateProfileRepository;
    let candidateId: string;

    beforeEach(async () => {
      await setup();
      repo = getRepository();
      candidateRepo = getCandidateRepository();

      const candidate = await candidateRepo.create({
        name: 'Test Candidate',
        email: `test-${Date.now()}@example.com`,
        role: 'Dev',
        experienceLevel: 'Mid'
      });
      candidateId = candidate.id;
    });

    afterEach(async () => {
      await teardown();
    });

    it('should create and find a session by id', async () => {
      const created = await repo.create({
        candidateId,
        status: 'pending',
        metadata: { currentQuestionIndex: 0 }
      });

      expect(created.id).toBeDefined();
      expect(created.candidateId).toBe(candidateId);
      expect(created.status).toBe('pending');

      const found = await repo.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.status).toBe('pending');
    });

    it('should return null when finding non-existent id', async () => {
      const found = await repo.findById('non-existent-id');
      expect(found).toBeNull();
    });

    it('should update an existing session', async () => {
      const created = await repo.create({
        candidateId,
        status: 'pending',
        metadata: {}
      });

      const updated = await repo.update(created.id, {
        status: 'in_progress',
        metadata: { currentQuestionIndex: 2 }
      });

      expect(updated).not.toBeNull();
      expect(updated?.status).toBe('in_progress');
      expect(updated?.metadata.currentQuestionIndex).toBe(2);

      const found = await repo.findById(created.id);
      expect(found?.status).toBe('in_progress');
    });

    it('should delete a session', async () => {
      const created = await repo.create({
        candidateId,
        status: 'pending',
        metadata: {}
      });

      const deleted = await repo.delete(created.id);
      expect(deleted).toBe(true);

      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });
  });
}

// Run the contract tests against Prisma implementation
describe('PrismaInterviewSessionRepository', () => {
  const prisma = DatabaseClient.getInstance();

  runSessionRepositoryContractTests(
    () => new InterviewSessionRepository(),
    () => new CandidateProfileRepository(),
    async () => {
      // Clear data before each test
      await prisma.score.deleteMany();
      await prisma.answer.deleteMany();
      await prisma.question.deleteMany();
      await prisma.report.deleteMany();
      await prisma.interview.deleteMany();
      await prisma.candidate.deleteMany();
    },
    async () => {
      // Clear data after each test
      await prisma.score.deleteMany();
      await prisma.answer.deleteMany();
      await prisma.question.deleteMany();
      await prisma.report.deleteMany();
      await prisma.interview.deleteMany();
      await prisma.candidate.deleteMany();
    }
  );
});
