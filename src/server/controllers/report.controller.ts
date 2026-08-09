import { Request, Response } from 'express';
import { IReportApiService } from '../services/reportApi.service';
import { IPaginationOptions } from '../types/report.types';

export class ReportController {
  constructor(private readonly reportService: IReportApiService) {}

  public getReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      if (!reportId) {
        res.status(400).json({ error: 'Missing reportId' });
        return;
      }

      const report = await this.reportService.getReport(reportId);
      res.status(200).json(report);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Report not found' });
      } else {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  };

  public getReportPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      if (!reportId) {
        res.status(400).json({ error: 'Missing reportId' });
        return;
      }

      const pdfStream = await this.reportService.getReportPdfStream(reportId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.pdf`);
      
      pdfStream.pipe(res);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Report not found' });
      } else {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  };

  public getCandidateHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { candidateId } = req.params;
      if (!candidateId) {
        res.status(400).json({ error: 'Missing candidateId' });
        return;
      }

      const options: IPaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string
      };

      if (options.fromDate && isNaN(Date.parse(options.fromDate))) {
         res.status(400).json({ error: 'Invalid fromDate' });
         return;
      }
      if (options.toDate && isNaN(Date.parse(options.toDate))) {
         res.status(400).json({ error: 'Invalid toDate' });
         return;
      }

      const history = await this.reportService.getCandidateHistory(candidateId, options);
      res.status(200).json(history);
    } catch (error: any) {
       res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };
}
