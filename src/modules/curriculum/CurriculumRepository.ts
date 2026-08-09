import { ICurriculumRepository } from './CurriculumInterfaces';
import { ICurriculum, IModule, ITopic, ISubtopic, ModuleId, TopicId, SubtopicId } from './CurriculumTypes';
import { logger } from '../../utils/logger';

export class CurriculumRepository implements ICurriculumRepository {
  private curriculum: ICurriculum | null = null;
  private moduleMap: Map<ModuleId, IModule> = new Map();
  private topicMap: Map<string, ITopic> = new Map(); // Key format: `${moduleId}::${topicId}`
  private subtopicMap: Map<string, ISubtopic> = new Map(); // Key format: `${moduleId}::${topicId}::${subtopicId}`

  public initialize(curriculum: ICurriculum): void {
    this.curriculum = curriculum;
    this.buildIndexes(curriculum);
    logger.info({ modulesLoaded: curriculum.modules.length }, 'Curriculum repository initialized and indexed');
  }

  private buildIndexes(curriculum: ICurriculum): void {
    this.moduleMap.clear();
    this.topicMap.clear();
    this.subtopicMap.clear();

    for (const mod of curriculum.modules) {
      this.moduleMap.set(mod.id, mod);
      
      for (const topic of mod.topics) {
        this.topicMap.set(`${mod.id}::${topic.id}`, topic);
        
        for (const subtopic of topic.subtopics) {
          this.subtopicMap.set(`${mod.id}::${topic.id}::${subtopic.id}`, subtopic);
        }
      }
    }
  }

  public getCurriculum(): ICurriculum {
    if (!this.curriculum) throw new Error('Curriculum not initialized. Call loadCurriculum first.');
    return this.curriculum;
  }

  public getModule(moduleId: ModuleId): IModule | null {
    return this.moduleMap.get(moduleId) || null;
  }

  public getTopic(moduleId: ModuleId, topicId: TopicId): ITopic | null {
    return this.topicMap.get(`${moduleId}::${topicId}`) || null;
  }

  public getSubtopic(moduleId: ModuleId, topicId: TopicId, subtopicId: SubtopicId): ISubtopic | null {
    return this.subtopicMap.get(`${moduleId}::${topicId}::${subtopicId}`) || null;
  }

  public getAllModules(): IModule[] {
    if (!this.curriculum) return [];
    return this.curriculum.modules;
  }

  public getTopicsByModule(moduleId: ModuleId): ITopic[] {
    const mod = this.getModule(moduleId);
    return mod ? mod.topics : [];
  }
}
