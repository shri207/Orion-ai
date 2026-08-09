import { Router, Request, Response, NextFunction } from 'express';
import { database } from '../container';
import { DatabaseClient } from '../modules/database/PrismaClient';

const router = Router();

/**
 * GET /api/report/leaderboard
 * Returns all completed interview reports joined with candidate name & role,
 * sorted by overallScore descending — used by the Dashboard leaderboard.
 */
router.get('/leaderboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = DatabaseClient.getInstance();

    const reports = await prisma.report.findMany({
      orderBy: { overallScore: 'desc' },
      take: 50,
      include: {
        interview: {
          include: {
            candidate: {
              include: { user: true }
            }
          }
        }
      }
    });

    const leaderboard = reports.map((r, index) => {
      // The Report model stores hiringRecommendation inside the `summary` JSON column
      // or it may be available via the abstracted IInterviewReport.reportData.
      // Use a safe cast to extract it if present.
      const anyR = r as any;
      const hiringRecommendation =
        anyR.hiringRecommendation ??
        anyR.reportData?.hiringRecommendation ??
        null;

      return {
        rank:                 index + 1,
        reportId:             r.id,
        candidateName:        r.interview.candidate.user.name,
        jobRole:              r.interview.candidate.role,
        overallScore:         Math.round(r.overallScore),
        generatedAt:          r.generatedAt,
        hiringRecommendation,
      };
    });

    return res.status(200).json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/report/:reportId
 * Returns the full report data for the frontend Report page.
 */
router.get('/:reportId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await database.interviewReports.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found', reportId });
    }

    const rd = report.reportData as any;

    // Shape the response to match ReportData interface expected by the frontend
    return res.status(200).json({
      reportId: report.id,
      candidateName:         rd?.candidateName      || 'Candidate',
      curriculum:            rd?.curriculum          || 'Technical',
      date:                  report.generatedAt
                               ? new Date(report.generatedAt).toLocaleDateString()
                               : new Date().toLocaleDateString(),
      scores: rd?.scores || {
        overall:           Math.round(report.overallScore || 0),
        communication:     Math.round((report.overallScore || 0) * 0.9),
        technicalDepth:    Math.round((report.overallScore || 0) * 0.95),
        confidence:        Math.round((report.overallScore || 0) * 1.0),
        problemSolving:    Math.round((report.overallScore || 0) * 0.95),
      },
      topicScores:           rd?.topicScores        || [],
      strengths:             rd?.strengths           || [],
      improvements:          rd?.weaknesses          || [],
      recommendedTopics:     rd?.recommendations     || [],
      // Full Q&A conversation log — available when interview used the new reportGenerator
      conversation:          rd?.conversation        || [],
      // Hiring Recommendation — provided by HiringRecommendationEngine (Feature 7)
      hiringRecommendation:  rd?.hiringRecommendation || (
        (report.overallScore || 0) >= 80 ? 'Strong Hire' :
        (report.overallScore || 0) >= 70 ? 'Hire' :
        (report.overallScore || 0) >= 65 ? 'Lean Hire' :
        (report.overallScore || 0) >= 55 ? 'Maybe' :
        (report.overallScore || 0) >= 45 ? 'No Hire' : 'Strong No Hire'
      ),
      hiringConfidence:      rd?.hiringConfidence    ?? null,
      hiringStrengths:       rd?.hiringStrengths     ?? [],
      hiringWeaknesses:      rd?.hiringWeaknesses    ?? [],
      hiringReasoning:       rd?.hiringReasoning     ?? [],
      aiSynthesis:           rd?.summary             || '',
      interviewFlow:         rd?.interviewFlow       || ['Introduction', 'Fundamentals', 'Deep Dive', 'System Design', 'Closing'],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/report/:reportId/pdf
 * Returns a simple text/plain "PDF" for now — a real implementation would use puppeteer/pdfkit.
 */
router.get('/:reportId/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await database.interviewReports.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const rd = report.reportData as any;
    const candidateName = rd?.candidateName || 'Candidate';
    const date = report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : new Date().toLocaleDateString();

    // Simple text PDF response — replace with pdfkit/puppeteer for production
    const content = [
      '===================================',
      '  INTERVIEW AGENT — ASSESSMENT REPORT',
      '===================================',
      `Candidate: ${candidateName}`,
      `Date: ${date}`,
      `Overall Score: ${report.overallScore || 0}/100`,
      '',
      'STRENGTHS:',
      ...(report.reportData?.strengths || []).map((s: string) => `  • ${s}`),
      '',
      'AREAS FOR IMPROVEMENT:',
      ...(report.reportData?.weaknesses || []).map((w: string) => `  • ${w}`),
      '',
      'RECOMMENDATIONS:',
      ...(report.reportData?.recommendations || []).map((r: string) => `  • ${r}`),
      '',
      'SUMMARY:',
      report.reportData?.summary || '',
      '',
      '=== END OF REPORT ===',
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="report-${reportId}.txt"`);
    return res.send(content);
  } catch (error) {
    next(error);
  }
});

export default router;
