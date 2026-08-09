import { IRubricEngineParams, IRubricEngineResult } from './RubricEngineTypes';

export interface IRubricEngine {
  evaluatePerformance(params: IRubricEngineParams): Promise<IRubricEngineResult>;
}
