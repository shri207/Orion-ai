import { IConfidenceEstimatorResult, ConfidenceLevel } from './ConfidenceEstimatorTypes';

export class ConfidenceEstimatorValidator {
  public static validate(data: any): IConfidenceEstimatorResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    return {
      overall_confidence_score: typeof data.overall_confidence_score === 'number' ? data.overall_confidence_score : 0,
      confidence_level: this.parseConfidenceLevel(data.confidence_level),
      confidence_indicators: Array.isArray(data.confidence_indicators) ? data.confidence_indicators : [],
      uncertainty_indicators: Array.isArray(data.uncertainty_indicators) ? data.uncertainty_indicators : [],
      hesitation_signals: Array.isArray(data.hesitation_signals) ? data.hesitation_signals : [],
      bluffing_probability: typeof data.bluffing_probability === 'number' ? data.bluffing_probability : 0,
      overconfidence_probability: typeof data.overconfidence_probability === 'number' ? data.overconfidence_probability : 0,
      consistency_score: typeof data.consistency_score === 'number' ? data.consistency_score : 0,
      claim_confidence: Array.isArray(data.claim_confidence) ? data.claim_confidence : [],
      language_patterns: data.language_patterns ? {
        certain_phrases: Array.isArray(data.language_patterns.certain_phrases) ? data.language_patterns.certain_phrases : [],
        uncertain_phrases: Array.isArray(data.language_patterns.uncertain_phrases) ? data.language_patterns.uncertain_phrases : [],
        hedging_phrases: Array.isArray(data.language_patterns.hedging_phrases) ? data.language_patterns.hedging_phrases : [],
        speculative_phrases: Array.isArray(data.language_patterns.speculative_phrases) ? data.language_patterns.speculative_phrases : []
      } : { certain_phrases: [], uncertain_phrases: [], hedging_phrases: [], speculative_phrases: [] },
      behavioral_summary: typeof data.behavioral_summary === 'string' ? data.behavioral_summary : '',
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }

  private static parseConfidenceLevel(level: any): ConfidenceLevel {
    const validLevels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return validLevels.includes(level) ? level as ConfidenceLevel : 'Medium';
  }
}
