import { ICommunicationAnalyzerResult } from './CommunicationAnalyzerTypes';

export class CommunicationAnalyzerValidator {
  public static validate(data: any): ICommunicationAnalyzerResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    const defaultScoreIssues = { score: 0, issues: [] };
    const defaultScoreFeedback = { score: 0, feedback: '' };

    return {
      overall_score: typeof data.overall_score === 'number' ? data.overall_score : 0,
      grammar: data.grammar ? {
        score: typeof data.grammar.score === 'number' ? data.grammar.score : 0,
        issues: Array.isArray(data.grammar.issues) ? data.grammar.issues : []
      } : defaultScoreIssues,
      clarity: data.clarity ? {
        score: typeof data.clarity.score === 'number' ? data.clarity.score : 0,
        issues: Array.isArray(data.clarity.issues) ? data.clarity.issues : []
      } : defaultScoreIssues,
      structure: data.structure ? {
        score: typeof data.structure.score === 'number' ? data.structure.score : 0,
        feedback: typeof data.structure.feedback === 'string' ? data.structure.feedback : ''
      } : defaultScoreFeedback,
      logical_flow: data.logical_flow ? {
        score: typeof data.logical_flow.score === 'number' ? data.logical_flow.score : 0,
        feedback: typeof data.logical_flow.feedback === 'string' ? data.logical_flow.feedback : ''
      } : defaultScoreFeedback,
      professionalism: data.professionalism ? {
        score: typeof data.professionalism.score === 'number' ? data.professionalism.score : 0,
        feedback: typeof data.professionalism.feedback === 'string' ? data.professionalism.feedback : ''
      } : defaultScoreFeedback,
      confidence_in_communication: data.confidence_in_communication ? {
        score: typeof data.confidence_in_communication.score === 'number' ? data.confidence_in_communication.score : 0,
        indicators: Array.isArray(data.confidence_in_communication.indicators) ? data.confidence_in_communication.indicators : []
      } : { score: 0, indicators: [] },
      filler_words: Array.isArray(data.filler_words) ? data.filler_words : [],
      repetition: Array.isArray(data.repetition) ? data.repetition : [],
      ambiguous_statements: Array.isArray(data.ambiguous_statements) ? data.ambiguous_statements : [],
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
      communication_feedback: typeof data.communication_feedback === 'string' ? data.communication_feedback : '',
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
