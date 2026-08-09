import { ITopicSelectionContext } from '../TopicSelectorTypes';
import { ITopic } from '../../curriculum/CurriculumTypes';

export class DependencyResolver {
  /**
   * Filters out topics whose prerequisites have not been met, 
   * or reduces their priority. For this implementation, we will strictly filter them out.
   */
  public static getEligibleTopics(
    availableTopics: ITopic[],
    context: ITopicSelectionContext
  ): ITopic[] {
    const { completedTopics, performanceRecord = {} } = context.topicState;
    const weakThreshold = context.config.TOPIC_SELECTOR_WEAK_TOPIC_THRESHOLD ?? 60;

    return availableTopics.filter(topic => {
      // If the topic structure has a generic dependencies/prerequisites array, evaluate it
      // Currently, CurriculumTypes ITopic might not have it strictly defined, so we check dynamically.
      const prerequisites: string[] = (topic as any).prerequisites || [];
      
      if (prerequisites.length === 0) return true;

      // Ensure all prerequisites are completed and not failing
      const prereqsMet = prerequisites.every(prereqId => {
        if (!completedTopics.includes(prereqId)) return false;
        
        // Ensure they didn't fail it critically
        const perf = performanceRecord[prereqId];
        if (perf && perf.averageScore < weakThreshold) {
          return false;
        }
        return true;
      });

      return prereqsMet;
    });
  }
}
