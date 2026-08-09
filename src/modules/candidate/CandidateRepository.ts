import { ICandidateRepository } from './CandidateInterfaces';
import { CandidateId, ICandidateProfile, ImmutableCandidateProfile, InterviewDifficulty, IExperience } from './CandidateTypes';
import { logger } from '../../utils/logger';

export class CandidateRepository implements ICandidateRepository {
  private candidates: Map<CandidateId, ImmutableCandidateProfile> = new Map();

  public saveCandidate(profile: ICandidateProfile): void {
    // Deep freeze the profile to make it deeply immutable
    const immutableProfile = this.deepFreeze(profile);
    this.candidates.set(profile.id, immutableProfile);
    logger.debug({ candidateId: profile.id }, 'Candidate profile saved to repository');
  }

  public getCandidate(id: CandidateId): ImmutableCandidateProfile | null {
    return this.candidates.get(id) || null;
  }

  public getSkills(id: CandidateId): { primary: ReadonlyArray<string>; secondary: ReadonlyArray<string> } | null {
    const candidate = this.getCandidate(id);
    if (!candidate) return null;
    return {
      primary: candidate.primarySkills,
      secondary: candidate.secondarySkills,
    };
  }

  public getExperience(id: CandidateId): ReadonlyArray<Readonly<IExperience>> | null {
    const candidate = this.getCandidate(id);
    return candidate ? candidate.experience : null;
  }

  public getDifficulty(id: CandidateId): InterviewDifficulty | null {
    const candidate = this.getCandidate(id);
    return candidate ? candidate.preferredDifficulty : null;
  }

  private deepFreeze<T>(obj: T): Readonly<T> {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    Object.freeze(obj);

    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const propVal = (obj as Record<string, unknown>)[prop];
      if (
        propVal !== null &&
        (typeof propVal === 'object' || typeof propVal === 'function') &&
        !Object.isFrozen(propVal)
      ) {
        this.deepFreeze(propVal);
      }
    });

    return obj as Readonly<T>;
  }
}
