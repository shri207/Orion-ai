import { ITopicSelectionContext, PerformanceClassification, ITopicPerformance } from '../TopicSelectorTypes';
import { ITopic } from '../../curriculum/CurriculumTypes';

export class TopicPriorityCalculator {
  /**
   * Calculates a priority score (0-100) for a given topic based on current context.
   */
  public static calculate(
    topic: ITopic,
    context: ITopicSelectionContext,
    performance?: PerformanceClassification
  ): number {
    let score = 50; // Base score

    // Curriculum Importance (25% weight roughly mapped)
    if ((topic as any).priority) {
      if ((topic as any).priority === 'high') score += 15;
      else if ((topic as any).priority === 'medium') score += 5;
      else score -= 10;
    }

    // Weakness Weight (25%)
    // If the topic hasn't been tested but the candidate profile marked it as a weak area
    const isWeakInProfile = context.candidateProfile?.weakAreas?.some((w: any) => w.name.toLowerCase() === topic.name.toLowerCase());
    if (isWeakInProfile) {
      score += 20;
    }

    if (performance) {
      if (performance === PerformanceClassification.CRITICAL) score += 25;
      else if (performance === PerformanceClassification.WEAK) score += 15;
      else if (performance === PerformanceClassification.STRONG) score -= 15; // less priority to repeat unless strategy dictates
    }

    // Interview Objective (5%)
    if (context.interviewPhase === 'START' && ((topic as any).difficulty === 'Easy' || (topic as any).difficulty === 'Medium')) {
      score += 10;
    } else if (context.interviewPhase === 'END' && ((topic as any).difficulty === 'Hard' || (topic as any).difficulty === 'Expert')) {
      score += 10;
    }

    // Difficulty Balance (15%)
    // If the topic matches the current difficulty level targeted by the context
    if ((topic as any).difficulty === context.currentDifficulty) {
      score += 15;
    }

    // Normalize to 0-100 bounds
    return Math.max(0, Math.min(100, score));
  }
}
