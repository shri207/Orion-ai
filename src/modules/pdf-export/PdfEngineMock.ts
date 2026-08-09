import { IPdfEngine } from './types';
import { Stream, PassThrough } from 'stream';

export class PdfEngineMock implements IPdfEngine {
  public addPage(): void {}
  public setFont(font: string): void {}
  public setFontSize(size: number): void {}
  public setTextColor(color: string): void {}
  public text(text: string, x: number, y: number, options?: any): void {}
  public rect(x: number, y: number, w: number, h: number, style?: string): void {}
  public image(imagePath: string, x: number, y: number, options?: any): void {}
  
  public async saveToFile(path: string): Promise<void> {}
  
  public async toBuffer(): Promise<Buffer> {
    return Buffer.from('Mock PDF Content');
  }
  
  public toStream(): Stream {
    const pt = new PassThrough();
    pt.end(Buffer.from('Mock PDF Content'));
    return pt;
  }
}
