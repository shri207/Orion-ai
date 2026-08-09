import { DatabaseClient } from './src/modules/database/PrismaClient';

async function seed() {
  const prisma = DatabaseClient.getInstance();
  try {
    let user = await prisma.user.findFirst({ where: { email: 'test@example.com' }});
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com' }
      });
    }

    let candidate = await prisma.candidate.findFirst({ where: { userId: user.id }});
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          userId: user.id,
          role: 'Full Stack Engineer',
          experienceLevel: 'Senior'
        }
      });
    }
    
    console.log(`\n==========================================`);
    console.log(`✅ Seed Successful`);
    console.log(`Candidate ID: ${candidate.id}`);
    console.log(`==========================================\n`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
