import { IHiringRecommendationEngineParams, IHiringRecommendationResult } from './HiringRecommendationEngineTypes';

export interface IHiringRecommendationEngine {
  evaluateRecommendation(params: IHiringRecommendationEngineParams): Promise<IHiringRecommendationResult>;
}
