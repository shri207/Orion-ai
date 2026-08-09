import { ITopicState, ITopicPerformance } from './TopicSelectorTypes';

export class TopicPerformanceTracker {
  /**
   * Generates a NEW ITopicState with the updated performance record.
   * This ensures immutability.
   */
  public static recordPerformance(
    currentState: ITopicState,
    topicId: string,
    evaluation: { score: number; technicalAccuracy: number; confidence?: number; isHintUsed?: boolean; followUp?: boolean; timeTakenMs?: number }
  ): ITopicState {
    const perfRecord = currentState.performanceRecord || {};
    const existingPerf = perfRecord[topicId] || this.createEmptyPerformance();

    const newQuestions = existingPerf.questionsAnswered + 1;
    const newAvgScore = ((existingPerf.averageScore * existingPerf.questionsAnswered) + evaluation.score) / newQuestions;
    const newAccuracy = ((existingPerf.technicalAccuracy * existingPerf.questionsAnswered) + evaluation.technicalAccuracy) / newQuestions;
    const newAvgConf = ((existingPerf.averageConfidence * existingPerf.questionsAnswered) + (evaluation.confidence ?? 0.8)) / newQuestions;

    const newPerformance: ITopicPerformance = {
      questionsAnswered: newQuestions,
      averageScore: newAvgScore,
      technicalAccuracy: newAccuracy,
      averageConfidence: newAvgConf,
      followUpCount: existingPerf.followUpCount + (evaluation.followUp ? 1 : 0),
      hintCount: existingPerf.hintCount + (evaluation.isHintUsed ? 1 : 0),
      timeTaken: existingPerf.timeTaken + (evaluation.timeTakenMs || 0),
      completionRate: 1.0, // stub logic, can be enhanced
      lastUpdated: new Date().toISOString()
    };

    return {
      ...currentState,
      performanceRecord: {
        ...perfRecord,
        [topicId]: newPerformance
      }
    };
  }

  private static createEmptyPerformance(): ITopicPerformance {
    return {
      questionsAnswered: 0,
      averageScore: 0,
      technicalAccuracy: 0,
      averageConfidence: 0,
      followUpCount: 0,
      hintCount: 0,
      timeTaken: 0,
      completionRate: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}
