import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

export const createTransactionRouter = (): Router => {
  const router = Router();
  const controller = new TransactionController();

  router.post('/ingest', controller.ingest);
  router.get('/analytics/velocity', controller.getVelocity);
  router.get('/analytics/footfall-hourly', controller.getHourlyDistribution);
  router.get('/analytics/lost-revenue', controller.getLostRevenue);
  router.get('/analytics/market-benchmark', controller.getMarketBenchmark);
  router.get('/history', controller.getHistory);

  return router;
};
