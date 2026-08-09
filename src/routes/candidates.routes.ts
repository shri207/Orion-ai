import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';

const router = Router();

import path from 'path';
const CANDIDATES_FILE = path.join(process.cwd(), 'frontend', 'src', 'data', 'candidates.json');

/** Map a job role string to a Material Symbol icon name */
function roleToIcon(jobRole: string): string {
  const r = jobRole.toLowerCase();
  if (r.includes('data') || r.includes('ml') || r.includes('ai')) return 'model_training';
  if (r.includes('frontend') || r.includes('ux') || r.includes('mobile')) return 'web';
  if (r.includes('backend') || r.includes('engineer') || r.includes('developer')) return 'code';
  if (r.includes('devops') || r.includes('cloud') || r.includes('infra')) return 'cloud';
  if (r.includes('architect') || r.includes('principal') || r.includes('distinguished')) return 'architecture';
  if (r.includes('hr') || r.includes('marketing') || r.includes('analyst')) return 'person';
  return 'work';
}

/**
 * GET /api/candidates
 * Returns the list of candidates from the external PROJECTS/candidates.json file,
 * shaped for use in the PreparePage candidate picker.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = await fs.readFile(CANDIDATES_FILE, 'utf-8');
    const data = JSON.parse(raw) as { candidates: Array<{
      member: {
        id: string;
        name: string;
        jobRole: string;
        yearsExperience: number;
        education: string;
        status: string;
      };
      missions: Array<{ day: number; title: string; passed?: boolean; skipped?: boolean; attempts?: number }>;
      signals: { commitDays: number; missionsCompleted: number; missionsFirstTry: number };
    }> };

    const candidates = data.candidates
      .filter(c => c.member.status === 'COMPLETED') // Only show candidates who completed the cohort
      .map(c => ({
        id: c.member.id,
        name: c.member.name,
        role: c.member.jobRole,
        icon: roleToIcon(c.member.jobRole),
        exp: c.member.yearsExperience === 0 ? 'Entry level' : `${c.member.yearsExperience} yrs`,
        education: c.member.education,
        signals: c.signals,
        missionsCompleted: c.missions.filter(m => m.passed).length,
        missionsTotal: c.missions.length,
      }));

    res.status(200).json({ candidates });
  } catch (err: any) {
    // If the file doesn't exist, return an empty list rather than a 500
    if (err.code === 'ENOENT') {
      return res.status(200).json({ candidates: [] });
    }
    next(err);
  }
});

export default router;
