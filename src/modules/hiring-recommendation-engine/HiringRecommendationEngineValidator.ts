import { IHiringRecommendationResult, HiringRecommendationDecision } from './HiringRecommendationEngineTypes';

export class HiringRecommendationEngineValidator {
  public static validate(data: any): IHiringRecommendationResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    const validateDecision = (val: any): HiringRecommendationDecision => {
      const valid: HiringRecommendationDecision[] = [
        'Strong Hire', 'Hire', 'Lean Hire', 'Maybe', 
        'Lean No Hire', 'No Hire', 'Strong No Hire'
      ];
      return valid.includes(val) ? val as HiringRecommendationDecision : 'Maybe';
    };

    return {
      recommendation: validateDecision(data.recommendation),
      confidence: typeof data.confidence === 'number' ? data.confidence : 0,
      overallScore: typeof data.overallScore === 'number' ? data.overallScore : 0,
      decisionFactors: data.decisionFactors ? {
        technical: typeof data.decisionFactors.technical === 'number' ? data.decisionFactors.technical : 0,
        communication: typeof data.decisionFactors.communication === 'number' ? data.decisionFactors.communication : 0,
        problemSolving: typeof data.decisionFactors.problemSolving === 'number' ? data.decisionFactors.problemSolving : 0,
        accuracy: typeof data.decisionFactors.accuracy === 'number' ? data.decisionFactors.accuracy : 0,
        coverage: typeof data.decisionFactors.coverage === 'number' ? data.decisionFactors.coverage : 0,
      } : { technical: 0, communication: 0, problemSolving: 0, accuracy: 0, coverage: 0 },
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      criticalGaps: Array.isArray(data.criticalGaps) ? data.criticalGaps : [],
      reasoning: Array.isArray(data.reasoning) ? data.reasoning : [],
      roleReadiness: data.roleReadiness ? {
        currentLevel: typeof data.roleReadiness.currentLevel === 'string' ? data.roleReadiness.currentLevel : 'Unknown',
        estimatedExperience: typeof data.roleReadiness.estimatedExperience === 'string' ? data.roleReadiness.estimatedExperience : 'Unknown',
        readyForProduction: typeof data.roleReadiness.readyForProduction === 'boolean' ? data.roleReadiness.readyForProduction : false,
      } : { currentLevel: 'Unknown', estimatedExperience: 'Unknown', readyForProduction: false },
      recommendations: data.recommendations ? {
        learningPriorities: Array.isArray(data.recommendations.learningPriorities) ? data.recommendations.learningPriorities : [],
        interviewSummary: typeof data.recommendations.interviewSummary === 'string' ? data.recommendations.interviewSummary : ''
      } : { learningPriorities: [], interviewSummary: '' },
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
