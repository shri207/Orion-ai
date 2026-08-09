import { ICandidateAnalyzerParams, ICandidateAnalyzerResult } from './CandidateAnalyzerTypes';

export interface ICandidateAnalyzer {
  analyzeAnswer(params: ICandidateAnalyzerParams): Promise<ICandidateAnalyzerResult>;
}
