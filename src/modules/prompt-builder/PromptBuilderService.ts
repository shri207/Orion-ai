import { IPromptBuilder, IPromptAssembler } from './PromptBuilderInterfaces';
import { IPromptBuilderParams, IPromptAssemblyResult } from './PromptBuilderTypes';

export class PromptBuilderService implements IPromptBuilder {
  constructor(private readonly assembler: IPromptAssembler) {}

  public buildPrompt(params: IPromptBuilderParams): IPromptAssemblyResult {
    return this.assembler.assemble(params);
  }
}
