import { describe, it, expect, beforeEach } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ReportGenerator } from '../../src/modules/report-generator/ReportGenerator';
import { ReportFormatter } from '../../src/modules/report-generator/formatter';
import { ReportSummaryGenerator } from '../../src/modules/report-generator/summary';
import { RecommendationEngineAdapter } from '../../src/modules/report-generator/recommendation';
import { IReportGeneratorInput } from '../../src/modules/report-generator/types';

describe('ReportGenerator', () => {
  const formatter = mock<ReportFormatter>();
  const summaryGen = mock<ReportSummaryGenerator>();
  const recommendation = mock<RecommendationEngineAdapter>();

  const generator = new ReportGenerator(formatter, summaryGen, recommendation);

  beforeEach(() => {
    formatter.formatCandidateInfo.mockReturnValue({ name: 'John', role: 'Dev' } as any);
    formatter.formatScores.mockReturnValue({ technical: 90, total: 90 } as any);
    formatter.formatTopicBreakdown.mockReturnValue([{ topic: 'React', score: 90 }] as any);
    summaryGen.generateStrengths.mockReturnValue(['Hooks']);
    summaryGen.generateWeaknesses.mockReturnValue(['None']);
    summaryGen.generateAISummary.mockReturnValue('Good');
    recommendation.determineRecommendation.mockReturnValue('Hire' as any);
  });

  it('should orchestrate report generation successfully', () => {
    const input: IReportGeneratorInput = {
      session: { id: 's1' } as any,
      candidateProfile: { id: 'c1' } as any,
      rubricScores: { technical: 90 } as any,
      skillMatrix: { React: 90 },
      communicationMetrics: { clarity: 90 },
      questionHistory: [],
      aiEvaluations: []
    };

    const result = generator.generateReport(input);

    expect(result.candidate.name).toBe('John');
    expect(result.scores.technical).toBe(90);
    expect(result.strengths).toContain('Hooks');
    expect(result.recommendation).toBe('Hire');

    expect(formatter.formatCandidateInfo).toHaveBeenCalled();
    expect(summaryGen.generateAISummary).toHaveBeenCalled();
    expect(recommendation.determineRecommendation).toHaveBeenCalled();
  });

  it('should throw an error if one of the dependencies fails', () => {
    formatter.formatScores.mockImplementation(() => {
      throw new Error('Formatting failed');
    });

    const input: IReportGeneratorInput = {
      session: { id: 's1' } as any,
      candidateProfile: { id: 'c1' } as any,
      rubricScores: { technical: 90 } as any,
      skillMatrix: { React: 90 },
      communicationMetrics: { clarity: 90 },
      questionHistory: [],
      aiEvaluations: []
    };

    expect(() => generator.generateReport(input)).toThrow('Failed to generate report: Formatting failed');
  });
});
