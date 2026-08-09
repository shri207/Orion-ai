import { IInterviewReport } from '../report-generator/types';
import { IImprovementPlan } from '../improvement-plan-generator/types';
import { Stream } from 'stream';

export interface IPdfExportInput {
  report: IInterviewReport;
  improvementPlan: IImprovementPlan;
  companyName?: string;
  logoPath?: string;
}

export interface IPdfEngine {
  addPage(): void;
  setFont(font: string): void;
  setFontSize(size: number): void;
  setTextColor(color: string): void;
  text(text: string, x: number, y: number, options?: any): void;
  rect(x: number, y: number, w: number, h: number, style?: string): void;
  image(imagePath: string, x: number, y: number, options?: any): void;
  saveToFile(path: string): Promise<void>;
  toBuffer(): Promise<Buffer>;
  toStream(): Stream;
}

export interface IPdfTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  headingColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface IPdfExportConfig {
  theme?: IPdfTheme;
  pageSize?: string;
  margin?: number;
}
