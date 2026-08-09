import { IPdfEngine, IPdfExportInput, IPdfExportConfig } from './types';
import { TableRenderer } from './TableRenderer';
import { ChartGenerator } from './ChartGenerator';
import { DefaultTheme } from './Theme';

export class ReportTemplate {
  constructor(
    private readonly tableRenderer: TableRenderer,
    private readonly chartGenerator: ChartGenerator
  ) {}

  public async render(engine: IPdfEngine, input: IPdfExportInput, config: IPdfExportConfig): Promise<void> {
    const theme = config.theme || DefaultTheme;
    const margin = config.margin || 50;
    let y = margin;

    engine.setFont(theme.fontFamily);
    
    engine.setTextColor(theme.headingColor);
    engine.setFontSize(24);
    engine.text('AI Interview Assessment Report', margin, y);
    y += 40;

    engine.setTextColor(theme.textColor);
    engine.setFontSize(14);
    engine.text(`Candidate: ${input.report.candidate.name}`, margin, y);
    y += 20;
    engine.text(`Role: ${input.report.candidate.role}`, margin, y);
    y += 20;
    engine.text(`Date: ${new Date(input.report.candidate.interviewDate).toLocaleDateString()}`, margin, y);
    
    engine.addPage();
    y = margin;

    engine.setTextColor(theme.headingColor);
    engine.setFontSize(18);
    engine.text('Executive Summary', margin, y);
    y += 30;

    engine.setTextColor(theme.textColor);
    engine.setFontSize(12);
    engine.text(input.report.aiSummary.text, margin, y);
    
    engine.addPage();
    y = margin;
    engine.setTextColor(theme.headingColor);
    engine.setFontSize(18);
    engine.text('Improvement Plan', margin, y);
    y += 30;
    engine.setTextColor(theme.textColor);
    engine.setFontSize(12);
    engine.text(input.improvementPlan.overview.readinessSummary, margin, y);
  }
}
