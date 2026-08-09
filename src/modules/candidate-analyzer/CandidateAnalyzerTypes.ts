import { InterviewDifficulty } from '../candidate/CandidateTypes';
import { ITopic } from '../curriculum/CurriculumTypes';

export interface IConceptDetection {
  name: string;
  confidence: number;
  mentioned: boolean;
}

export interface ICandidateAnalyzerMetadata {
  processing_time_ms: number;
  model: string;
}

export interface ICandidateAnalyzerResult {
  concepts_detected: IConceptDetection[];
  missing_concepts: string[];
  misconceptions: string[];
  knowledge_gaps: string[];
  reasoning_style: string;
  guessing_signals: string[];
  uncertainty_signals: string[];
  answer_summary: string;
  analysis_notes: string;
  metadata: ICandidateAnalyzerMetadata;
}

export interface ICandidateAnalyzerParams {
  interviewQuestion: string;
  candidateAnswer: string;
  topicMetadata: ITopic | string;
  difficulty: InterviewDifficulty;
  expectedConcepts?: string[];
}
