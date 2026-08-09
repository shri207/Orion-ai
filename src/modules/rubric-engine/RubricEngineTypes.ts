import { ICandidateAnalyzerResult } from '../candidate-analyzer/CandidateAnalyzerTypes';
import { ITechnicalAccuracyResult } from '../technical-accuracy-checker/TechnicalAccuracyCheckerTypes';
import { ISession } from '../session/SessionInterfaces';

export interface IRubricWeights {
  technical: number;
  problemSolving: number;
  accuracy: number;
  communication: number;
  confidence: number;
  depth: number;
}

export interface IRubricScores {
  technical: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  depth: number;
  accuracy: number;
}

export interface IRubricReasoning {
  technical: string;
  communication: string;
  confidence: string;
  problemSolving: string;
  depth: string;
  accuracy: string;
}

export interface IRubricEngineResult {
  scores: IRubricScores;
  weightedScore: number;
  grade: string;
  reasoning: IRubricReasoning;
  metadata?: {
    processing_time_ms: number;
    model: string;
  };
}

export interface IRubricEngineParams {
  interviewType: string;
  weights: IRubricWeights;
  candidateAnalyzerOutput?: ICandidateAnalyzerResult;
  technicalAccuracyOutput?: ITechnicalAccuracyResult;
  followUpEvaluatorOutput?: any; 
  sessionState?: ISession;
  questionMetadata: any;
  candidateAnswer: string;
}
