import { IPdfExportInput, IPdfExportConfig, IPdfEngine } from './types';
import { ReportTemplate } from './ReportTemplate';
import { Stream } from 'stream';

export class PdfExporter {
  constructor(
    private readonly engineProvider: () => IPdfEngine,
    private readonly template: ReportTemplate
  ) {}

  public async exportToFile(input: IPdfExportInput, outputPath: string, config: IPdfExportConfig = {}): Promise<void> {
    const engine = this.engineProvider();
    await this.template.render(engine, input, config);
    await engine.saveToFile(outputPath);
  }

  public async exportToBuffer(input: IPdfExportInput, config: IPdfExportConfig = {}): Promise<Buffer> {
    const engine = this.engineProvider();
    await this.template.render(engine, input, config);
    return await engine.toBuffer();
  }

  public async exportToStream(input: IPdfExportInput, config: IPdfExportConfig = {}): Promise<Stream> {
    const engine = this.engineProvider();
    await this.template.render(engine, input, config);
    return engine.toStream();
  }
}
