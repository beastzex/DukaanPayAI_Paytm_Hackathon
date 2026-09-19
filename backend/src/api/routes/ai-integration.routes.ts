import { Router } from 'express';
import { AIIntegrationController } from '../controllers/ai-integration.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';

export const createAIIntegrationRouter = (): Router => {
  const router = Router();
  const controller = new AIIntegrationController();

  router.get('/merchant-context/:id', authenticateJwt, controller.getMerchantContext);
  router.post('/recommendations', authenticateJwt, controller.ingestRecommendation);

  return router;
};
