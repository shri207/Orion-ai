import { ICurriculum, IModule, ITopic, ISubtopic, ModuleId, TopicId, SubtopicId } from './CurriculumTypes';

export interface ICurriculumLoader {
  loadCurriculum(filePath: string): Promise<ICurriculum>;
}

export interface ICurriculumRepository {
  getCurriculum(): ICurriculum;
  getModule(moduleId: ModuleId): IModule | null;
  getTopic(moduleId: ModuleId, topicId: TopicId): ITopic | null;
  getSubtopic(moduleId: ModuleId, topicId: TopicId, subtopicId: SubtopicId): ISubtopic | null;
  getAllModules(): IModule[];
  getTopicsByModule(moduleId: ModuleId): ITopic[];
}
