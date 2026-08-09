import { ICandidateAnalyzerResult } from '../candidate-analyzer/CandidateAnalyzerTypes';

export interface IScoreWithIssues {
  score: number;
  issues: string[];
}

export interface IScoreWithFeedback {
  score: number;
  feedback: string;
}

export interface IConfidenceResult {
  score: number;
  indicators: string[];
}

export interface IFillerWord {
  word: string;
  count: number;
}

export interface ICommunicationAnalyzerMetadata {
  processing_time_ms: number;
  model: string;
}

export interface ICommunicationAnalyzerResult {
  overall_score: number;
  grammar: IScoreWithIssues;
  clarity: IScoreWithIssues;
  structure: IScoreWithFeedback;
  logical_flow: IScoreWithFeedback;
  professionalism: IScoreWithFeedback;
  confidence_in_communication: IConfidenceResult;
  filler_words: IFillerWord[];
  repetition: string[];
  ambiguous_statements: string[];
  strengths: string[];
  improvements: string[];
  communication_feedback: string;
  metadata: ICommunicationAnalyzerMetadata;
}

export interface ICommunicationAnalyzerParams {
  interviewQuestion: string;
  candidateAnswer: string;
  candidateAnalyzerOutput?: ICandidateAnalyzerResult;
}
