import { CandidateId, ICandidateProfile, ImmutableCandidateProfile, InterviewDifficulty, IExperience } from './CandidateTypes';

export interface ICandidateLoader {
  loadCandidate(filePath: string): Promise<ImmutableCandidateProfile>;
}

export interface ICandidateRepository {
  saveCandidate(profile: ICandidateProfile): void;
  getCandidate(id: CandidateId): ImmutableCandidateProfile | null;
  getSkills(id: CandidateId): { primary: ReadonlyArray<string>; secondary: ReadonlyArray<string> } | null;
  getExperience(id: CandidateId): ReadonlyArray<Readonly<IExperience>> | null;
  getDifficulty(id: CandidateId): InterviewDifficulty | null;
}
