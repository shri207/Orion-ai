import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ICandidateProfileRepository } from '../../src/modules/database/DatabaseTypes';
import { CandidateProfileRepository } from '../../src/modules/database/repositories/CandidateProfileRepository';
import { DatabaseClient } from '../../src/modules/database/PrismaClient';

export function runCandidateRepositoryContractTests(
  getRepository: () => ICandidateProfileRepository,
  setup: () => Promise<void>,
  teardown: () => Promise<void>
) {
  describe('ICandidateProfileRepository Contract', () => {
    let repo: ICandidateProfileRepository;

    beforeEach(async () => {
      await setup();
      repo = getRepository();
    });

    afterEach(async () => {
      await teardown();
    });

    it('should create and find a candidate by id', async () => {
      const email = `test-${Date.now()}@example.com`;
      const created = await repo.create({
        name: 'Jane Doe',
        email,
        role: 'Designer',
        experienceLevel: 'Senior'
      });

      expect(created.id).toBeDefined();
      expect(created.email).toBe(email);

      const found = await repo.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Jane Doe');
    });

    it('should find a candidate by email', async () => {
      const email = `test-${Date.now()}@example.com`;
      await repo.create({
        name: 'Jane Doe',
        email,
        role: 'Designer',
        experienceLevel: 'Senior'
      });

      const found = await repo.findByEmail(email);
      expect(found).not.toBeNull();
      expect(found?.email).toBe(email);
    });

    it('should return null for non-existent candidate', async () => {
      const found = await repo.findById('non-existent');
      expect(found).toBeNull();
    });

    it('should update a candidate', async () => {
      const email = `test-${Date.now()}@example.com`;
      const created = await repo.create({
        name: 'Jane Doe',
        email,
        role: 'Designer',
        experienceLevel: 'Senior'
      });

      const updated = await repo.update(created.id, { experienceLevel: 'Lead' });
      expect(updated).not.toBeNull();
      expect(updated?.experienceLevel).toBe('Lead');

      const found = await repo.findById(created.id);
      expect(found?.experienceLevel).toBe('Lead');
    });

    it('should delete a candidate', async () => {
      const email = `test-${Date.now()}@example.com`;
      const created = await repo.create({
        name: 'Jane Doe',
        email,
        role: 'Designer',
        experienceLevel: 'Senior'
      });

      const deleted = await repo.delete(created.id);
      expect(deleted).toBe(true);

      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });
  });
}

describe('PrismaCandidateProfileRepository', () => {
  const prisma = DatabaseClient.getInstance();

  runCandidateRepositoryContractTests(
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
