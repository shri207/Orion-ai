import { ICandidateProfile, InterviewDifficulty } from './CandidateTypes';

export class CandidateValidator {
  public static validateCandidate(data: any): ICandidateProfile {
    if (!data || typeof data !== 'object') {
      throw new Error('Candidate profile must be an object');
    }

    const requiredStrings = ['id', 'name', 'email', 'role', 'resumeSummary', 'preferredLanguage'];
    for (const field of requiredStrings) {
      if (typeof data[field] !== 'string') {
        throw new Error(`Candidate profile is missing or has invalid string field: ${field}`);
      }
    }

    if (typeof data.yearsOfExperience !== 'number') {
      throw new Error('Candidate profile must have a numeric yearsOfExperience');
    }

    const validDifficulties: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];
    if (!validDifficulties.includes(data.preferredDifficulty)) {
      throw new Error(`Invalid preferredDifficulty. Must be one of: ${validDifficulties.join(', ')}`);
    }

    if (!Array.isArray(data.primarySkills)) throw new Error('primarySkills must be an array');
    if (!Array.isArray(data.secondarySkills)) throw new Error('secondarySkills must be an array');
    if (!Array.isArray(data.experience)) throw new Error('experience must be an array');
    if (!Array.isArray(data.projects)) throw new Error('projects must be an array');
    if (!Array.isArray(data.education)) throw new Error('education must be an array');
    if (!Array.isArray(data.certifications)) throw new Error('certifications must be an array');

    return data as ICandidateProfile;
  }
}
