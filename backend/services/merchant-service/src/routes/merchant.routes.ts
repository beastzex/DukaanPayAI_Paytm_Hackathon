import { Router } from 'express';
import { MerchantController } from '../controllers/MerchantController';

export const createMerchantRouter = (): Router => {
  const router = Router();
  const controller = new MerchantController();

  // Public Auth Endpoints
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.post('/refresh-token', controller.refreshToken);

  // Merchant Endpoints
  router.get('/:id/profile', controller.getProfile);
  router.patch('/:id/preferences', controller.updatePreferences);

  return router;
};
