import { ITopicResources, IPriorityImprovement } from './types';

export class ResourceRecommender {
  public recommendResources(priorities: IPriorityImprovement[]): ITopicResources[] {
    return priorities.map(p => ({
      topic: p.topic,
      resources: [
        {
          title: `Official Documentation for ${p.topic}`,
          type: 'Documentation',
          description: 'Always start with the official docs for the most accurate information.'
        },
        {
          title: `${p.topic} Deep Dive`,
          type: 'Course',
          description: 'A comprehensive video course covering fundamentals to advanced topics.'
        },
        {
          title: `Practice ${p.topic} Challenges`,
          type: 'Practice Platform',
          description: 'Interactive coding challenges to test your understanding.'
        }
      ]
    }));
  }
}
