import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { ReportApiService } from '../services/reportApi.service';

export const createReportRouter = (): Router => {
  const router = Router();
  
  const reportService = new ReportApiService();
  const reportController = new ReportController(reportService);

  router.get('/:reportId', reportController.getReport);
  router.get('/:reportId/pdf', reportController.getReportPdf);
  router.get('/history/:candidateId', reportController.getCandidateHistory);

  return router;
};
