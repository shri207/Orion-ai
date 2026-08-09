import curriculumData from '../data/curriculum.json';

export interface SubTopic {
  id:                 string;
  name:               string;
  learningObjectives?: string[];
}

export interface CurriculumTopic {
  id:          string;
  name:        string;
  description: string;
  subtopics?:  SubTopic[];
}

export interface CurriculumModule {
  id:          string;
  name:        string;
  source:      string;
  description: string;
  topics:      CurriculumTopic[];
}

export interface CurriculumResponse {
  modules: CurriculumModule[];
}

// Convert the local JSON into the legacy expected format
const mappedModules: CurriculumModule[] = curriculumData.modules.map(mod => {
  const moduleDays = curriculumData.days.filter(d => d.day >= mod.days[0] && d.day <= mod.days[1]);
  
  return {
    id: `mod-${mod.n}`,
    name: mod.title,
    source: 'AI Cohort',
    description: `Days ${mod.days[0]} - ${mod.days[1]}`,
    topics: moduleDays.map(day => ({
      id: `day-${day.day}`,
      name: `Day ${day.day}`,
      description: day.title,
      subtopics: [
        {
          id: `tools-${day.day}`,
          name: 'Tools',
          learningObjectives: day.tools
        },
        {
          id: `obj-${day.day}`,
          name: 'Objectives',
          learningObjectives: day.objectives
        }
      ]
    }))
  };
});

export async function getCurriculum(): Promise<CurriculumResponse> {
  return { modules: mappedModules };
}

export async function getCurriculumModule(moduleId: string): Promise<{ module: CurriculumModule }> {
  const mod = mappedModules.find(m => m.id === moduleId);
  if (!mod) throw new Error('Module not found');
  return { module: mod };
}
