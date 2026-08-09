import fs from 'fs/promises';
import { ICurriculumLoader } from './CurriculumInterfaces';
import { ICurriculum } from './CurriculumTypes';
import { CurriculumValidator } from './CurriculumValidator';
import { CurriculumRepository } from './CurriculumRepository';
import { logger } from '../../utils/logger';

export class CurriculumLoader implements ICurriculumLoader {
  constructor(private readonly repository: CurriculumRepository) {}

  public async loadCurriculum(filePath: string): Promise<ICurriculum> {
    try {
      logger.info({ filePath }, 'Loading curriculum file');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      const rawData = JSON.parse(fileContent);
      
      // Perform runtime validation
      const validCurriculum = CurriculumValidator.validateCurriculum(rawData);
      
      // Cache the loaded curriculum into the repository to enable read-only lookups
      this.repository.initialize(validCurriculum);
      
      return validCurriculum;
    } catch (error) {
      logger.error({ filePath, error }, 'Failed to load curriculum');
      throw error;
    }
  }
}
