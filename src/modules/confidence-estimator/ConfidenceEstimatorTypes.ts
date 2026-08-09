import { ICandidateAnalyzerResult } from '../candidate-analyzer/CandidateAnalyzerTypes';
import { ICommunicationAnalyzerResult } from '../communication-analyzer/CommunicationAnalyzerTypes';

export type ConfidenceLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

export interface IClaimConfidence {
  claim: string;
  confidence: number;
  evidence: string;
}

export interface ILanguagePatterns {
  certain_phrases: string[];
  uncertain_phrases: string[];
  hedging_phrases: string[];
  speculative_phrases: string[];
}

export interface IConfidenceEstimatorMetadata {
  processing_time_ms: number;
  model: string;
}

export interface IConfidenceEstimatorResult {
  overall_confidence_score: number;
  confidence_level: ConfidenceLevel;
  confidence_indicators: string[];
  uncertainty_indicators: string[];
  hesitation_signals: string[];
  bluffing_probability: number;
  overconfidence_probability: number;
  consistency_score: number;
  claim_confidence: IClaimConfidence[];
  language_patterns: ILanguagePatterns;
  behavioral_summary: string;
  recommendations: string[];
  metadata: IConfidenceEstimatorMetadata;
}

export interface IConfidenceEstimatorParams {
  interviewQuestion: string;
  candidateAnswer: string;
  candidateAnalyzerOutput?: ICandidateAnalyzerResult;
  communicationAnalyzerOutput?: ICommunicationAnalyzerResult;
}
