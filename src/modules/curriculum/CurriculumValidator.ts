import { ICurriculum } from './CurriculumTypes';

export class CurriculumValidator {
  public static validateCurriculum(data: any): ICurriculum {
    if (!data || typeof data !== 'object') {
      throw new Error('Curriculum data must be an object');
    }

    if (typeof data.version !== 'string') {
      throw new Error('Curriculum must have a version string');
    }

    if (!Array.isArray(data.modules)) {
      throw new Error('Curriculum modules must be an array');
    }

    data.modules.forEach((mod: any, mIndex: number) => {
      this.validateModule(mod, mIndex);
    });

    return data as ICurriculum;
  }

  private static validateModule(mod: any, index: number): void {
    if (!mod.id || typeof mod.name !== 'string' || !Array.isArray(mod.topics)) {
      throw new Error(`Invalid module at index ${index}. Must have id, name, and topics array.`);
    }

    mod.topics.forEach((topic: any, tIndex: number) => {
      this.validateTopic(topic, index, tIndex);
    });
  }

  private static validateTopic(topic: any, mIndex: number, tIndex: number): void {
    if (!topic.id || typeof topic.name !== 'string' || !Array.isArray(topic.subtopics)) {
      throw new Error(`Invalid topic at module ${mIndex} topic ${tIndex}. Must have id, name, and subtopics array.`);
    }

    topic.subtopics.forEach((subtopic: any, sIndex: number) => {
      this.validateSubtopic(subtopic, mIndex, tIndex, sIndex);
    });
  }

  private static validateSubtopic(subtopic: any, mIndex: number, tIndex: number, sIndex: number): void {
    if (!subtopic.id || typeof subtopic.name !== 'string' || !Array.isArray(subtopic.learningObjectives)) {
      throw new Error(`Invalid subtopic at module ${mIndex} topic ${tIndex} subtopic ${sIndex}. Must have id, name, and learningObjectives array.`);
    }

    subtopic.learningObjectives.forEach((lo: any, lIndex: number) => {
      if (typeof lo !== 'string') {
        throw new Error(`Learning objective at module ${mIndex} topic ${tIndex} subtopic ${sIndex} index ${lIndex} must be a string.`);
      }
    });
  }
}
