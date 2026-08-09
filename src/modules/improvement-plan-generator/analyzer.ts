import { IImprovementOverview, IImprovementPlanInput } from './types';

export class ImprovementAnalyzer {
  public generateOverview(input: IImprovementPlanInput): IImprovementOverview {
    const score = input.rubricScores?.overall || 0;
    
    let proficiencyLevel = 'Beginner';
    if (score >= 85) proficiencyLevel = 'Expert';
    else if (score >= 70) proficiencyLevel = 'Advanced';
    else if (score >= 50) proficiencyLevel = 'Intermediate';

    let readinessSummary = 'Needs significant improvement before interviewing again.';
    if (score >= 85) readinessSummary = 'Ready for immediate placement or senior roles.';
    else if (score >= 70) readinessSummary = 'Ready for the role, with minor areas to polish.';
    else if (score >= 50) readinessSummary = 'Close to ready, requires focused study on core weaknesses.';

    return {
      overallAssessment: `The candidate achieved an overall score of ${score}/100.`,
      proficiencyLevel,
      readinessSummary
    };
  }
}
