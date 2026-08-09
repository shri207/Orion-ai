import { IInterviewReport, IReportGeneratorInput } from './types';
import { ReportFormatter } from './formatter';
import { ReportSummaryGenerator } from './summary';
import { RecommendationEngineAdapter } from './recommendation';

export class ReportGenerator {
  constructor(
    private readonly formatter: ReportFormatter,
    private readonly summaryGenerator: ReportSummaryGenerator,
    private readonly recommendationAdapter: RecommendationEngineAdapter
  ) {}

  public generateReport(input: IReportGeneratorInput): IInterviewReport {
    try {
      const candidate = this.formatter.formatCandidateInfo(input.session, input.candidateProfile);
      const scores = this.formatter.formatScores(input.rubricScores, input.skillMatrix, input.communicationMetrics);
      const topicBreakdown = this.formatter.formatTopicBreakdown(input.questionHistory || [], input.aiEvaluations || []);
      const strengths = this.summaryGenerator.generateStrengths(input.skillMatrix, input.aiEvaluations || []);
      const weaknesses = this.summaryGenerator.generateWeaknesses(input.skillMatrix, input.aiEvaluations || []);
      const aiSummary = this.summaryGenerator.generateAISummary(input);
      const recommendation = this.recommendationAdapter.determineRecommendation(scores);

      return {
        candidate,
        scores,
        topicBreakdown,
        strengths,
        weaknesses,
        aiSummary,
        recommendation
      };
    } catch (error) {
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
