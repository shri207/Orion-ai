import { 
  IResponseParserService, 
  IJsonExtractor, 
  IJsonRepair, 
  ISchemaValidator, 
  IResponseNormalizer, 
  IParserMetrics 
} from './ResponseParserInterfaces';
import { IValidationSchema, IParserConfig, IParseResult } from './ResponseParserTypes';
import { ParserError, ParserErrorCode } from './ParserError';

export class ResponseParserService implements IResponseParserService {
  constructor(
    private readonly extractor: IJsonExtractor,
    private readonly repairer: IJsonRepair,
    private readonly validator: ISchemaValidator,
    private readonly normalizer: IResponseNormalizer,
    private readonly metrics: IParserMetrics
  ) {}

  public parse<T>(rawResponse: string, schema?: IValidationSchema, config?: IParserConfig): IParseResult<T> {
    const startTime = Date.now();
    const defaultConfig: IParserConfig = {
      enableRecovery: true,
      normalizeKeys: true,
      trimWhitespace: true,
      ...config
    };

    if (!rawResponse || rawResponse.trim() === '') {
      throw new ParserError(ParserErrorCode.EMPTY_RESPONSE, 'Response is empty');
    }

    const byteSize = Buffer.byteLength(rawResponse, 'utf-8');
    
    let candidates = this.extractor.extract(rawResponse);
    if (candidates.length === 0) candidates = [rawResponse];

    let parsedData: any = null;
    let recovered = false;
    let recoveryAttempts = 0;

    for (const text of candidates) {
      try {
        parsedData = JSON.parse(text);
        break;
      } catch (e) {
        if (defaultConfig.enableRecovery) {
          recoveryAttempts++;
          try {
            const repaired = this.repairer.repair(text);
            parsedData = JSON.parse(repaired);
            recovered = true;
            break;
          } catch (repairErr) {
            continue;
          }
        }
      }
    }

    if (parsedData === null) {
      throw new ParserError(ParserErrorCode.INVALID_JSON, 'Could not parse response into valid JSON', rawResponse, null, recoveryAttempts);
    }

    if (schema) {
      const validationResult = this.validator.validate(parsedData, schema);
      if (!validationResult.isValid) {
        this.metrics.record({ validationFailures: 1 });
        throw new ParserError(
          ParserErrorCode.SCHEMA_VALIDATION_FAILURE, 
          'Schema validation failed', 
          rawResponse, 
          validationResult.errors, 
          recoveryAttempts
        );
      }
    }

    const normalizedData = this.normalizer.normalize(parsedData, defaultConfig);
    
    const duration = Date.now() - startTime;
    const metricsData = {
      parseDurationMs: duration,
      recoveryAttempts,
      successfulRecoveries: recovered ? 1 : 0,
      validationFailures: 0,
      responseSizeBytes: byteSize,
      estimatedTokens: Math.ceil(byteSize / 4)
    };
    this.metrics.record(metricsData);

    return {
      success: true,
      data: normalizedData as T,
      metrics: metricsData,
      recovered
    };
  }
}
