import { IStreamingResponseParser, IJsonExtractor, IJsonRepair } from './ResponseParserInterfaces';
import { IStreamParseResult } from './ResponseParserTypes';

export class StreamingResponseParser implements IStreamingResponseParser {
  private buffer: string = '';
  
  constructor(
    private extractor: IJsonExtractor,
    private repairer: IJsonRepair
  ) {}

  public processChunk(chunk: string): void {
    this.buffer += chunk;
  }

  public getLatest<T>(): IStreamParseResult<T> {
    const extracted = this.extractor.extract(this.buffer);
    const candidate = extracted.length > 0 ? extracted[0] : this.buffer;
    
    try {
      const data = JSON.parse(candidate);
      return { isComplete: true, data };
    } catch (e) {
      try {
        const repaired = this.repairer.repair(candidate);
        const partialData = JSON.parse(repaired);
        return { isComplete: false, partialData };
      } catch (err) {
        return { isComplete: false };
      }
    }
  }

  public reset(): void {
    this.buffer = '';
  }
}
