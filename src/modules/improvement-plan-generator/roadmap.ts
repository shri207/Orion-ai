import { ILearningPhase, IPriorityImprovement } from './types';

export class RoadmapGenerator {
  public generateRoadmap(priorities: IPriorityImprovement[]): ILearningPhase[] {
    const phases: ILearningPhase[] = [];
    
    if (priorities.length > 0) {
      phases.push({
        phaseName: 'Phase 1: Core Fundamentals (Highest Priority)',
        topics: priorities.filter(p => p.severity === 'Critical' || p.severity === 'High').map(p => p.topic),
        learningObjectives: ['Master the basic concepts', 'Understand edge cases'],
        practicalExercises: ['Implement concepts from scratch', 'Solve easy-level problems'],
        miniProjects: ['Build a small CLI tool using these concepts'],
        completionCriteria: ['Can explain concepts without looking at docs', 'Solve 10 related problems']
      });
    }

    if (priorities.length > 2) {
      phases.push({
        phaseName: 'Phase 2: Advanced Application',
        topics: priorities.filter(p => p.severity === 'Medium').map(p => p.topic),
        learningObjectives: ['Apply concepts in complex scenarios', 'Optimize for performance'],
        practicalExercises: ['Solve medium/hard problems', 'Refactor existing code'],
        miniProjects: ['Integrate concepts into a larger web application'],
        completionCriteria: ['Optimal solutions for medium problems', 'Successful project integration']
      });
    }

    return phases;
  }
}
