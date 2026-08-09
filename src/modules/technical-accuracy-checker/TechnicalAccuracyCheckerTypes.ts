import { InterviewDifficulty } from '../candidate/CandidateTypes';
import { ITopic } from '../curriculum/CurriculumTypes';
import { ICandidateAnalyzerResult } from '../candidate-analyzer/CandidateAnalyzerTypes';

export interface IConceptScore {
  concept: string;
  score: number;
  status: 'correct' | 'partially_correct' | 'incorrect' | 'missing';
  feedback: string;
}

export interface IFactualError {
  statement: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ITechnicalAccuracyMetadata {
  processing_time_ms: number;
  model: string;
}

export interface ITechnicalAccuracyResult {
  overall_score: number;
  technical_accuracy: number;
  concept_scores: IConceptScore[];
  correct_concepts: string[];
  partially_correct_concepts: string[];
  incorrect_concepts: string[];
  missing_concepts: string[];
  factual_errors: IFactualError[];
  misconceptions: string[];
  question_coverage: number;
  strengths: string[];
  improvements: string[];
  technical_feedback: string;
  metadata: ITechnicalAccuracyMetadata;
}

export interface ITechnicalAccuracyCheckerParams {
  interviewQuestion: string;
  candidateAnswer: string;
  topicMetadata: ITopic | string;
  difficulty: InterviewDifficulty;
  expectedConcepts: string[];
  candidateAnalyzerOutput?: ICandidateAnalyzerResult;
}
