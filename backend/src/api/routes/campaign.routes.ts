import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { idempotencyMiddleware } from '../../middleware/idempotency.middleware';

export const createCampaignRouter = (): Router => {
  const router = Router();
  const controller = new CampaignController();

  router.post('/', authenticateJwt, controller.create);
  router.post('/:id/execute', authenticateJwt, controller.execute);
  router.get('/merchant/:merchantId', authenticateJwt, controller.listByMerchant);

  return router;
};
