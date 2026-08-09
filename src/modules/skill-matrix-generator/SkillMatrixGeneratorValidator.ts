import { ISkillMatrixResult, SkillClassification } from './SkillMatrixGeneratorTypes';

export class SkillMatrixGeneratorValidator {
  public static validate(data: any): ISkillMatrixResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    const validateClassification = (val: any): SkillClassification => {
      const valid: SkillClassification[] = ['Strong', 'Good', 'Average', 'Weak', 'Critical Gap'];
      return valid.includes(val) ? val as SkillClassification : 'Average';
    };

    return {
      overallCoverage: typeof data.overallCoverage === 'number' ? data.overallCoverage : 0,
      skills: Array.isArray(data.skills) ? data.skills.map((s: any) => ({
        topic: typeof s.topic === 'string' ? s.topic : 'Unknown',
        competency: typeof s.competency === 'number' ? s.competency : 0,
        confidence: typeof s.confidence === 'number' ? s.confidence : 0,
        coverage: typeof s.coverage === 'number' ? s.coverage : 0,
        classification: validateClassification(s.classification),
        strengths: Array.isArray(s.strengths) ? s.strengths : [],
        weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses : [],
        missingConcepts: Array.isArray(s.missingConcepts) ? s.missingConcepts : [],
        evidence: Array.isArray(s.evidence) ? s.evidence : []
      })) : [],
      summary: data.summary ? {
        strongestSkills: Array.isArray(data.summary.strongestSkills) ? data.summary.strongestSkills : [],
        weakestSkills: Array.isArray(data.summary.weakestSkills) ? data.summary.weakestSkills : [],
        criticalGaps: Array.isArray(data.summary.criticalGaps) ? data.summary.criticalGaps : [],
        recommendedLearningOrder: Array.isArray(data.summary.recommendedLearningOrder) ? data.summary.recommendedLearningOrder : []
      } : { strongestSkills: [], weakestSkills: [], criticalGaps: [], recommendedLearningOrder: [] },
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
