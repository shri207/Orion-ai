import { ICommunicationAnalyzerParams, ICommunicationAnalyzerResult } from './CommunicationAnalyzerTypes';

export interface ICommunicationAnalyzer {
  analyzeCommunication(params: ICommunicationAnalyzerParams): Promise<ICommunicationAnalyzerResult>;
}
