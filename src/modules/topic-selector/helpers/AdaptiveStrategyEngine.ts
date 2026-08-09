import { ITopicSelectionContext, AdaptiveStrategy, PerformanceClassification } from '../TopicSelectorTypes';
import { ITopic } from '../../curriculum/CurriculumTypes';
import { TopicPriorityCalculator } from './TopicPriorityCalculator';

export class AdaptiveStrategyEngine {
  public static scoreTopics(
    eligibleTopics: ITopic[],
    context: ITopicSelectionContext
  ): { topic: ITopic; score: number }[] {
    return eligibleTopics.map(topic => {
      const perfRec = context.topicState.performanceRecord?.[topic.id];
      const perfClass = perfRec ? this.classifyPerformance(perfRec, context) : undefined;
      
      let score = TopicPriorityCalculator.calculate(topic, context, perfClass);

      // Strategy adjustments
      switch (context.adaptiveStrategy) {
        case AdaptiveStrategy.WEAKNESS_FIRST:
          // Boost weak topics even further
          if (perfClass === PerformanceClassification.WEAK || perfClass === PerformanceClassification.CRITICAL) {
            score += 30;
          }
          break;
        case AdaptiveStrategy.CHALLENGE_MODE:
          // Boost hard/expert topics
          if ((topic as any).difficulty === 'Hard' || (topic as any).difficulty === 'Expert') {
            score += 25;
          }
          break;
        case AdaptiveStrategy.DEPTH_FIRST:
          // Boost topics that have some coverage but are not fully completed 
          // (mocked here as having some performance record but still in remaining array)
          if (perfRec && perfRec.questionsAnswered < 3) {
            score += 20;
          }
          break;
        case AdaptiveStrategy.BREADTH_FIRST:
          // Boost topics with NO performance record
          if (!perfRec) {
            score += 20;
          }
          break;
        case AdaptiveStrategy.BALANCED:
        default:
          // TopicPriorityCalculator is balanced by default
          break;
      }

      return { topic, score };
    });
  }

  public static classifyPerformance(perf: any, context: ITopicSelectionContext): PerformanceClassification {
    const score = perf.averageScore;
    const weakThresh = context.config.TOPIC_SELECTOR_WEAK_TOPIC_THRESHOLD ?? 60;
    const criticalThresh = context.config.TOPIC_SELECTOR_CRITICAL_TOPIC_THRESHOLD ?? 40;

    if (score >= 90) return PerformanceClassification.STRONG;
    if (score >= 75) return PerformanceClassification.GOOD;
    if (score >= weakThresh) return PerformanceClassification.AVERAGE;
    if (score >= criticalThresh) return PerformanceClassification.WEAK;
    return PerformanceClassification.CRITICAL;
  }
}
