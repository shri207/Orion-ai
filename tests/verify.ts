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

async function run() {
  const baseURL = 'http://localhost:5000/api/interview';

  try {
    let candidate = await prisma.candidate.findFirst();
    if (!candidate) {
        console.log('Creating candidate...');
        const user = await prisma.user.create({
            data: {
              name: 'Test User',
              email: `test_${Date.now()}@example.com`
            }
        });
        candidate = await prisma.candidate.create({
            data: {
              userId: user.id,
              role: 'Senior React Developer',
              experienceLevel: 'Senior'
            }
        });
    }

    console.log(`Using Candidate ID: ${candidate.id}`);

    console.log('1. Starting Interview...');
    const startRes = await fetch(`${baseURL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: candidate.id,
        curriculum: 'Senior React Developer'
      })
    });
    
    if (!startRes.ok) throw new Error(await startRes.text());
    const startData = await startRes.json();

    const sessionId = startData.sessionId;
    console.log(`Session ID: ${sessionId}`);
    console.log(`First Question: ${startData.firstQuestion}`);

    if (!sessionId) {
      throw new Error('Failed to get session ID');
    }

    console.log('\n2. Answering Question...');
    const answerRes = await fetch(`${baseURL}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        answer: 'I use useEffect with a dependency array to fetch data.'
      })
    });
    
    if (!answerRes.ok) throw new Error(await answerRes.text());
    const answerData = await answerRes.json();

    console.log(`Next Question: ${answerData.nextQuestion}`);
    console.log(`Score: ${answerData.score}`);

    console.log('\n3. Ending Interview...');
    const endRes = await fetch(`${baseURL}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId
      })
    });
    
    if (!endRes.ok) throw new Error(await endRes.text());
    const endData = await endRes.json();

    console.log(`Interview Report ID: ${endData.reportId}`);
    
    if (!endData.reportId) {
        throw new Error('reportId was not returned from the end endpoint');
    }
    
    // Verify FK constraint passes by verifying report exists in DB
    const report = await prisma.report.findFirst({
      where: { id: endData.reportId }
    });
    
    if (!report) throw new Error('Report not found in DB - FK failed or insert failed');
    console.log(`Verified report in DB for interview: ${report.interviewId}`);
    
    console.log('\nVerification Passed! ✅');
  } catch (error: any) {
    console.error('Verification Failed! ❌');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
