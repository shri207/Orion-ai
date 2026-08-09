import { ITechnicalAccuracyCheckerParams, ITechnicalAccuracyResult } from './TechnicalAccuracyCheckerTypes';

export interface ITechnicalAccuracyChecker {
  evaluateAccuracy(params: ITechnicalAccuracyCheckerParams): Promise<ITechnicalAccuracyResult>;
}
