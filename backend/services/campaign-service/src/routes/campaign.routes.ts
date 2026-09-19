import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';

export const createCampaignRouter = (): Router => {
  const router = Router();
  const controller = new CampaignController();

  router.post('/draft', controller.draft);
  router.post('/approve', controller.approve);
  router.get('/history', controller.getCampaigns);

  return router;
};
