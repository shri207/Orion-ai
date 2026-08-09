import { IParserConfig, IParseResult, IValidationSchema, IParserMetricsData, IStreamParseResult } from './ResponseParserTypes';

export interface IJsonExtractor {
  extract(rawText: string): string[];
}

export interface IJsonRepair {
  repair(brokenJson: string): string;
}

export interface ISchemaValidator {
  validate(data: any, schema: IValidationSchema): { isValid: boolean; errors: string[] };
}

export interface IResponseNormalizer {
  normalize(data: any, config: IParserConfig): any;
}

export interface IParserMetrics {
  record(metrics: Partial<IParserMetricsData>): void;
  getSummary(): IParserMetricsData;
}

export interface IResponseParserService {
  parse<T>(rawResponse: string, schema?: IValidationSchema, config?: IParserConfig): IParseResult<T>;
}

export interface IStreamingResponseParser {
  processChunk(chunk: string): void;
  getLatest<T>(): IStreamParseResult<T>;
  reset(): void;
}
