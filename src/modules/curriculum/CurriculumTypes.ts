export type CurriculumId = string;
export type ModuleId = string;
export type TopicId = string;
export type SubtopicId = string;

export interface ISubtopic {
  id: SubtopicId;
  name: string;
  learningObjectives: string[];
}

export interface ITopic {
  id: TopicId;
  name: string;
  description: string;
  subtopics: ISubtopic[];
}

export interface IModule {
  id: ModuleId;
  name: string;
  description: string;
  topics: ITopic[];
}

export interface ICurriculum {
  version: string;
  modules: IModule[];
}
