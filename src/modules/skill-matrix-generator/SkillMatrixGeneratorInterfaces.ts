import { ISkillMatrixGeneratorParams, ISkillMatrixResult } from './SkillMatrixGeneratorTypes';

export interface ISkillMatrixGenerator {
  generateMatrix(params: ISkillMatrixGeneratorParams): Promise<ISkillMatrixResult>;
}
