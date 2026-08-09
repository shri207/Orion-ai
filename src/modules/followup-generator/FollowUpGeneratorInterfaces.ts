import { IFollowUpGeneratorParams, IGeneratedFollowUp } from './FollowUpGeneratorTypes';

export interface IFollowUpGenerator {
  generateFollowUp(params: IFollowUpGeneratorParams): Promise<IGeneratedFollowUp>;
}
