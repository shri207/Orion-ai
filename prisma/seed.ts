import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { parse } from 'pg-connection-string';

const config = parse(process.env.DATABASE_URL as string);
config.password = String(config.password);
const pool = new Pool(config as any);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'jane.doe@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    }
  });

  const candidatesToSeed = [
    { id: '513e35dd-89de-4af0-9ba3-c70f7a4996d8', name: 'John Chen', role: 'Senior Frontend Engineer', exp: '6 yrs' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Sarah Kim', role: 'ML Engineer', exp: '4 yrs' },
    { id: 'f0e1d2c3-b4a5-6789-0123-456789abcdef', name: 'Alex Rodriguez', role: 'Backend Engineer', exp: '7 yrs' },
    { id: '11223344-5566-7788-99aa-bbccddeeff00', name: 'Emily Watson', role: 'Full Stack Developer', exp: '5 yrs' },
  ];

  let firstCandidateId: string | null = null;

  for (const c of candidatesToSeed) {
    const candidate = await prisma.candidate.upsert({
      where: { id: c.id },
      update: {
        userId: user.id,
        role: c.role,
        experienceLevel: c.exp
      },
      create: {
        id: c.id,
        userId: user.id,
        role: c.role,
        experienceLevel: c.exp
      }
    });
    if (!firstCandidateId) firstCandidateId = candidate.id;
  }

  // Create a mock completed interview for the first candidate
  const interview = await prisma.interview.create({
    data: {
      candidateId: firstCandidateId!,
      status: 'completed',
      currentTopic: 'System Design',
      difficulty: 'Hard',
      startedAt: new Date(Date.now() - 3600000),
      endedAt: new Date()
    }
  });

  const question = await prisma.question.create({
    data: {
      interviewId: interview.id,
      topic: 'System Design',
      difficulty: 'Hard',
      question: 'Design a distributed rate limiter.',
      order: 1
    }
  });

  const answer = await prisma.answer.create({
    data: {
      interviewId: interview.id,
      questionId: question.id,
      answer: 'I would use Redis with a sliding window log algorithm.',
      latency: 1200,
      tokensUsed: 150
    }
  });

  await prisma.score.create({
    data: {
      interviewId: interview.id,
      questionId: question.id,
      answerId: answer.id,
      score: 95.0,
      feedback: 'Excellent approach, correctly identified sliding window using Redis.'
    }
  });

  await prisma.report.create({
    data: {
      interviewId: interview.id,
      summary: 'Excellent performance throughout.',
      strengths: ['System Design', 'Caching'],
      weaknesses: ['DB normalization depth'],
      recommendations: ['Review advanced Postgres partitioning'],
      overallScore: 92.5
    }
  });

  console.log(`Seeded User: ${user.email} and 4 Candidates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

