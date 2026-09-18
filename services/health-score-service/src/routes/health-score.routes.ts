import { Router } from 'express';
import { HealthScoreController } from '../controllers/HealthScoreController';

export const createHealthScoreRouter = (): Router => {
  const router = Router();
  const controller = new HealthScoreController();

  router.post('/evaluate', controller.evaluate);
  router.get('/current', controller.getScore);
  router.get('/credit-eligibility', controller.getCredit);

  return router;
};
