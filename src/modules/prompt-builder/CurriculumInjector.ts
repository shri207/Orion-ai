import { ICurriculumInjector } from './PromptBuilderInterfaces';

export class CurriculumInjector implements ICurriculumInjector {
  public inject(curriculum: any): string {
    if (!curriculum) return '';
    return `
Current Topic: ${curriculum.currentTopic || 'N/A'}
Topic Description: ${curriculum.topicDescription || 'N/A'}
Learning Objectives: ${curriculum.learningObjectives?.join(', ') || 'N/A'}
Expected Competencies: ${curriculum.expectedCompetencies?.join(', ') || 'N/A'}
Difficulty: ${curriculum.difficulty || 'N/A'}
Prerequisites: ${curriculum.prerequisites?.join(', ') || 'N/A'}
    `.trim();
  }
}
