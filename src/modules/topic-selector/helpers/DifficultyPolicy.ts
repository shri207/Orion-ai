import { ITopicSelectionContext, PerformanceClassification } from '../TopicSelectorTypes';
import { InterviewDifficulty } from '../../candidate/CandidateTypes';

export class DifficultyPolicy {
  private static readonly DIFFICULTY_LEVELS: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];

  public static calculateNextDifficulty(
    context: ITopicSelectionContext,
    recentClassifications: PerformanceClassification[]
  ): InterviewDifficulty {
    const escalationThreshold = context.config.TOPIC_SELECTOR_DIFFICULTY_ESCALATION_THRESHOLD ?? 3;
    const deescalationThreshold = context.config.TOPIC_SELECTOR_DIFFICULTY_DEESCALATION_THRESHOLD ?? 2;

    const currentIdx = this.DIFFICULTY_LEVELS.indexOf(context.currentDifficulty);
    if (currentIdx === -1) return 'Medium'; // Safe fallback

    // Check escalation
    const recentStrong = recentClassifications.slice(-escalationThreshold);
    if (
      recentStrong.length === escalationThreshold &&
      recentStrong.every(c => c === PerformanceClassification.STRONG || c === PerformanceClassification.GOOD)
    ) {
      return this.DIFFICULTY_LEVELS[Math.min(this.DIFFICULTY_LEVELS.length - 1, currentIdx + 1)];
    }

    // Check de-escalation
    const recentWeak = recentClassifications.slice(-deescalationThreshold);
    if (
      recentWeak.length === deescalationThreshold &&
      recentWeak.every(c => c === PerformanceClassification.WEAK || c === PerformanceClassification.CRITICAL)
    ) {
      return this.DIFFICULTY_LEVELS[Math.max(0, currentIdx - 1)];
    }

    // Phase-based limits
    // e.g. Do not go to expert in START phase
    if (context.interviewPhase === 'START' && currentIdx >= 2) { // Hard or Expert
      return 'Medium';
    }

    return context.currentDifficulty;
  }
}
