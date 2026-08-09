import { IPdfEngine } from './types';

export class TableRenderer {
  public renderTable(engine: IPdfEngine, startX: number, startY: number, headers: string[], rows: string[][]): number {
    let currentY = startY;
    const rowHeight = 20;
    
    engine.setFont('Helvetica-Bold');
    engine.setFontSize(10);
    headers.forEach((header, i) => {
      engine.text(header, startX + (i * 100), currentY);
    });
    
    currentY += rowHeight;
    engine.setFont('Helvetica');
    
    rows.forEach(row => {
      row.forEach((cell, i) => {
        engine.text(cell, startX + (i * 100), currentY);
      });
      currentY += rowHeight;
    });
    
    return currentY;
  }
}
