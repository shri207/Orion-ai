import { IResponseNormalizer } from './ResponseParserInterfaces';
import { IParserConfig } from './ResponseParserTypes';

export class ResponseNormalizer implements IResponseNormalizer {
  public normalize(data: any, config: IParserConfig): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map(item => this.normalize(item, config));
    }

    if (typeof data === 'object') {
      const normalized: any = {};
      for (const key of Object.keys(data)) {
        let newKey = key;
        if (config.normalizeKeys) {
          newKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
        }
        
        normalized[newKey] = this.normalize(data[key], config);
      }
      return normalized;
    }

    if (typeof data === 'string' && config.trimWhitespace) {
      return data.trim();
    }

    return data;
  }
}
