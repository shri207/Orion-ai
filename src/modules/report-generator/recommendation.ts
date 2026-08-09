import { HiringRecommendation, IReportScores } from './types';

export class RecommendationEngineAdapter {
  public determineRecommendation(scores: IReportScores): HiringRecommendation {
    if (scores.overall >= 85) return 'Strong Hire';
    if (scores.overall >= 70) return 'Hire';
    if (scores.overall >= 60) return 'Borderline';
    return 'No Hire';
  }
}
