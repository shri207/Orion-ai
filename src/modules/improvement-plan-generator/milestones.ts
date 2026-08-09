import { IMilestone, ISuccessMetrics, IEstimatedTimeline, IImprovementPlanInput } from './types';

export class MilestoneGenerator {
  public generateTimeline(input: IImprovementPlanInput): IEstimatedTimeline {
    const score = input.rubricScores?.overall || 0;
    
    let duration = '3 Months';
    let hours = 10;
    
    if (score >= 80) {
      duration = '2 Weeks';
      hours = 5;
    } else if (score >= 60) {
      duration = '1 Month';
      hours = 8;
    }

    const weeks = parseInt(duration) * (duration.includes('Month') ? 4 : 1);

    return {
      duration,
      estimatedHoursPerWeek: hours,
      totalLearningHours: hours * weeks
    };
  }

  public generateMilestones(input: IImprovementPlanInput): IMilestone[] {
    return [
      { description: 'Complete fundamental review of all identified weaknesses', isKeyMilestone: true },
      { description: 'Solve 20 practice problems related to core topics', isKeyMilestone: false },
      { description: 'Build and deploy the Phase 1 mini-project', isKeyMilestone: true },
      { description: 'Achieve 80% success rate on medium difficulty questions', isKeyMilestone: false },
      { description: 'Complete a full mock interview with improved confidence', isKeyMilestone: true }
    ];
  }

  public generateSuccessMetrics(): ISuccessMetrics {
    return {
      topicMastery: 'Able to explain topics clearly and solve related problems without assistance.',
      practiceCompletion: '100% completion of recommended practical exercises.',
      mockInterviewScoreTarget: 85,
      confidenceImprovement: 'Noticeably reduced hesitation and clear, structured communication.',
      communicationImprovement: 'Use of STAR method for behavioral and structured whiteboarding for technical.'
    };
  }
}
