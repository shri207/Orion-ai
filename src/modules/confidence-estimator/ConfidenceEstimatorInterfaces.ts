import { IConfidenceEstimatorParams, IConfidenceEstimatorResult } from './ConfidenceEstimatorTypes';

export interface IConfidenceEstimator {
  estimateConfidence(params: IConfidenceEstimatorParams): Promise<IConfidenceEstimatorResult>;
}
