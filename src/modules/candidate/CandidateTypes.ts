export type CandidateId = string;
export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface IEducation {
  degree: string;
  institution: string;
  year: number;
}

export interface ICertification {
  name: string;
  issuer: string;
  year: number;
}

export interface IExperience {
  company: string;
  role: string;
  years: number;
}

export interface ICandidateProfile {
  id: CandidateId;
  name: string;
  email: string;
  role: string;
  yearsOfExperience: number;
  primarySkills: string[];
  secondarySkills: string[];
  experience: IExperience[];
  projects: IProject[];
  education: IEducation[];
  certifications: ICertification[];
  resumeSummary: string;
  preferredDifficulty: InterviewDifficulty;
  preferredLanguage: string;
}

export type ImmutableCandidateProfile = Readonly<Omit<ICandidateProfile, 'primarySkills' | 'secondarySkills' | 'experience' | 'projects' | 'education' | 'certifications'>> & {
  primarySkills: ReadonlyArray<string>;
  secondarySkills: ReadonlyArray<string>;
  experience: ReadonlyArray<Readonly<IExperience>>;
  projects: ReadonlyArray<Readonly<IProject>>;
  education: ReadonlyArray<Readonly<IEducation>>;
  certifications: ReadonlyArray<Readonly<ICertification>>;
};
