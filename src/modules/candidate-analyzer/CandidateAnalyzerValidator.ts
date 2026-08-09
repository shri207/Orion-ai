import { ICandidateAnalyzerResult } from './CandidateAnalyzerTypes';

export class CandidateAnalyzerValidator {
  public static validate(data: any): ICandidateAnalyzerResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    return {
      concepts_detected: Array.isArray(data.concepts_detected) ? data.concepts_detected : [],
      missing_concepts: Array.isArray(data.missing_concepts) ? data.missing_concepts : [],
      misconceptions: Array.isArray(data.misconceptions) ? data.misconceptions : [],
      knowledge_gaps: Array.isArray(data.knowledge_gaps) ? data.knowledge_gaps : [],
      reasoning_style: typeof data.reasoning_style === 'string' ? data.reasoning_style : 'Unknown',
      guessing_signals: Array.isArray(data.guessing_signals) ? data.guessing_signals : [],
      uncertainty_signals: Array.isArray(data.uncertainty_signals) ? data.uncertainty_signals : [],
      answer_summary: typeof data.answer_summary === 'string' ? data.answer_summary : '',
      analysis_notes: typeof data.analysis_notes === 'string' ? data.analysis_notes : '',
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
