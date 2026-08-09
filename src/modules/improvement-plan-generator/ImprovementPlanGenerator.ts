import { IImprovementPlanInput, IImprovementPlan } from './types';
import { ImprovementAnalyzer } from './analyzer';
import { PriorityIdentifier } from './priorities';
import { RoadmapGenerator } from './roadmap';
import { ResourceRecommender } from './resources';
import { MilestoneGenerator } from './milestones';
import { RecommendationGenerator } from './recommendations';

export class ImprovementPlanGenerator {
  constructor(
    private readonly analyzer: ImprovementAnalyzer,
    private readonly priorities: PriorityIdentifier,
    private readonly roadmap: RoadmapGenerator,
    private readonly resources: ResourceRecommender,
    private readonly milestones: MilestoneGenerator,
    private readonly recommendations: RecommendationGenerator
  ) {}

  public generatePlan(input: IImprovementPlanInput): IImprovementPlan {
    try {
      const overview = this.analyzer.generateOverview(input);
      const priorityList = this.priorities.identifyPriorities(input);
      const learningRoadmap = this.roadmap.generateRoadmap(priorityList);
      const recommendedResources = this.resources.recommendResources(priorityList);
      const practicePlan = this.recommendations.generatePracticePlan();
      const timeline = this.milestones.generateTimeline(input);
      const milestoneList = this.milestones.generateMilestones(input);
      const successMetrics = this.milestones.generateSuccessMetrics();
      const finalEncouragement = this.recommendations.generateFinalEncouragement();

      return {
        overview,
        priorities: priorityList,
        roadmap: learningRoadmap,
        resources: recommendedResources,
        practicePlan,
        timeline,
        milestones: milestoneList,
        successMetrics,
        finalEncouragement
      };
    } catch (error) {
      throw new Error(`Failed to generate improvement plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
