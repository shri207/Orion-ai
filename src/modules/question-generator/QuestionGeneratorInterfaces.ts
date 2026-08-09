import { IQuestionGeneratorParams, IGeneratedQuestion } from './QuestionGeneratorTypes';

export interface IQuestionGenerator {
  generateQuestion(params: IQuestionGeneratorParams): Promise<IGeneratedQuestion>;
}
