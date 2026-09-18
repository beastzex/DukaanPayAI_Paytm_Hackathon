import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/rbac.middleware';
import { UserRole } from '../../domain/entities/entities';

export const createAnalyticsRouter = (): Router => {
  const router = Router();
  const controller = new AnalyticsController();

  router.get('/metrics', authenticateJwt, controller.getMetrics);
  router.get(
    '/audit-logs',
    authenticateJwt,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPPORT),
    controller.getAuditLogs
  );

  return router;
};
