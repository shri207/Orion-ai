import { IPriorityImprovement, IImprovementPlanInput } from './types';

export class PriorityIdentifier {
  public identifyPriorities(input: IImprovementPlanInput): IPriorityImprovement[] {
    const priorities: IPriorityImprovement[] = [];
    
    const weaknesses = input.report?.weaknesses || [];
    
    weaknesses.forEach((weakness, index) => {
      const severity = index === 0 ? 'Critical' : (index < 3 ? 'High' : 'Medium');
      
      priorities.push({
        topic: weakness.description.replace('Needs improvement in ', ''),
        severity,
        whyItMatters: `This is a foundational skill required for ${input.candidateProfile?.role || 'the target role'}.`,
        expectedImpact: 'Mastering this will significantly improve problem-solving efficiency and system design capabilities.'
      });
    });

    return priorities;
  }
}
