import { ITopicSelectorParams, ITopicSelectorResult } from './TopicSelectorTypes';

export interface ITopicSelector {
  selectNextTopic(params: ITopicSelectorParams): ITopicSelectorResult;
}
