import fs from 'fs/promises';
import { ICandidateLoader, ICandidateRepository } from './CandidateInterfaces';
import { ImmutableCandidateProfile } from './CandidateTypes';
import { CandidateValidator } from './CandidateValidator';
import { logger } from '../../utils/logger';

export class CandidateProfileLoader implements ICandidateLoader {
  constructor(private readonly repository: ICandidateRepository) {}

  public async loadCandidate(filePath: string): Promise<ImmutableCandidateProfile> {
    try {
      logger.info({ filePath }, 'Loading candidate profile file');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      const rawData = JSON.parse(fileContent);
      
      const validProfile = CandidateValidator.validateCandidate(rawData);
      
      this.repository.saveCandidate(validProfile);
      
      const savedProfile = this.repository.getCandidate(validProfile.id);
      if (!savedProfile) {
        throw new Error('Failed to retrieve candidate from repository after saving');
      }
      
      return savedProfile;
    } catch (error) {
      logger.error({ filePath, error }, 'Failed to load candidate profile');
      throw error;
    }
  }
}
