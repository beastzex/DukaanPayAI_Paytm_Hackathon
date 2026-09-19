import { Router } from 'express';
import { MerchantController } from '../controllers/merchant.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/rbac.middleware';
import { UserRole } from '../../domain/entities/entities';

export const createMerchantRouter = (): Router => {
  const router = Router();
  const controller = new MerchantController();

  router.get('/:id', authenticateJwt, controller.getProfile);
  router.get('/:id/profile', authenticateJwt, controller.getProfile);
  router.post('/', controller.register);
  router.post('/register', controller.register);
  router.patch(
    '/:id/settings',
    authenticateJwt,
    authorizeRoles(UserRole.MERCHANT, UserRole.ADMIN),
    controller.updateSettings
  );

  return router;
};
