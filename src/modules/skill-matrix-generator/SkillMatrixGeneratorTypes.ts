import { ISession } from '../session/SessionInterfaces';
import { IRubricEngineResult } from '../rubric-engine/RubricEngineTypes';

export type SkillClassification = 'Strong' | 'Good' | 'Average' | 'Weak' | 'Critical Gap';

export interface ISkillCompetency {
  topic: string;
  competency: number;
  confidence: number;
  coverage: number;
  classification: SkillClassification;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  evidence: string[];
}

export interface ISkillMatrixSummary {
  strongestSkills: string[];
  weakestSkills: string[];
  criticalGaps: string[];
  recommendedLearningOrder: string[];
}

export interface ISkillMatrixMetadata {
  processing_time_ms: number;
  model: string;
}

export interface ISkillMatrixResult {
  overallCoverage: number;
  skills: ISkillCompetency[];
  summary: ISkillMatrixSummary;
  metadata: ISkillMatrixMetadata;
}

export interface ISkillMatrixGeneratorParams {
  sessionData: ISession;
  perQuestionAnalysis: any[];
  rubricEngineOutput: IRubricEngineResult;
  topicMetadata: any[];
}
