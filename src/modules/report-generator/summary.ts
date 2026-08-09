import { IReportEvidence, IReportSummary, IReportGeneratorInput } from './types';

export class ReportSummaryGenerator {
  public generateStrengths(skillMatrix: any, aiEvaluations: any[]): IReportEvidence[] {
    const strengths: IReportEvidence[] = [];
    
    if (skillMatrix?.topSkills) {
      skillMatrix.topSkills.forEach((skill: any) => {
        strengths.push({
          description: `Strong in ${skill.name}`,
          evidence: skill.evidence || 'Consistently answered questions correctly in this area.'
        });
      });
    }

    return strengths;
  }

  public generateWeaknesses(skillMatrix: any, aiEvaluations: any[]): IReportEvidence[] {
    const weaknesses: IReportEvidence[] = [];
    
    if (skillMatrix?.areasForImprovement) {
      skillMatrix.areasForImprovement.forEach((skill: any) => {
        weaknesses.push({
          description: `Needs improvement in ${skill.name}`,
          evidence: skill.evidence || 'Struggled with complex questions in this area.'
        });
      });
    }

    return weaknesses;
  }

  public generateAISummary(input: IReportGeneratorInput): IReportSummary {
    const paragraphs: string[] = [];
    const name = input.candidateProfile?.name || 'The candidate';
    
    const overallScore = input.rubricScores?.overall || 0;
    const performance = overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'solid' : 'below expectations';
    paragraphs.push(`${name} demonstrated a ${performance} overall performance during the interview.`);

    const commScore = input.communicationMetrics?.overallScore || 0;
    const communication = commScore >= 80 ? 'clear and effective' : commScore >= 60 ? 'adequate' : 'needs improvement';
    paragraphs.push(`${name}'s communication skills were ${communication}.`);

    const techScore = input.rubricScores?.technical || 0;
    const technical = techScore >= 80 ? 'deep understanding' : techScore >= 60 ? 'working knowledge' : 'limited grasp';
    paragraphs.push(`From a technical perspective, the candidate showed a ${technical} of the core concepts discussed.`);

    return {
      text: paragraphs.join('\n\n')
    };
  }
}
