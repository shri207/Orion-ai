import { ITechnicalAccuracyResult } from './TechnicalAccuracyCheckerTypes';

export class TechnicalAccuracyCheckerValidator {
  public static validate(data: any): ITechnicalAccuracyResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    return {
      overall_score: typeof data.overall_score === 'number' ? data.overall_score : 0,
      technical_accuracy: typeof data.technical_accuracy === 'number' ? data.technical_accuracy : 0,
      concept_scores: Array.isArray(data.concept_scores) ? data.concept_scores : [],
      correct_concepts: Array.isArray(data.correct_concepts) ? data.correct_concepts : [],
      partially_correct_concepts: Array.isArray(data.partially_correct_concepts) ? data.partially_correct_concepts : [],
      incorrect_concepts: Array.isArray(data.incorrect_concepts) ? data.incorrect_concepts : [],
      missing_concepts: Array.isArray(data.missing_concepts) ? data.missing_concepts : [],
      factual_errors: Array.isArray(data.factual_errors) ? data.factual_errors : [],
      misconceptions: Array.isArray(data.misconceptions) ? data.misconceptions : [],
      question_coverage: typeof data.question_coverage === 'number' ? data.question_coverage : 0,
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
      technical_feedback: typeof data.technical_feedback === 'string' ? data.technical_feedback : '',
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
