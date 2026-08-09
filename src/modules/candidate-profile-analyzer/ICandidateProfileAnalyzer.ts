import { ICandidateAnalysisResult } from './types/CandidateAnalysisResult';

export interface ICandidateProfileAnalyzerParams {
  profileText: string;
}

export interface ICandidateProfileAnalyzer {
  analyzeProfile(params: ICandidateProfileAnalyzerParams): Promise<ICandidateAnalysisResult>;
}
