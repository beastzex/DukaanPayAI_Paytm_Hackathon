import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { rateLimiter } from '../../middleware/rate-limiter.middleware';

export const createAuthRouter = (): Router => {
  const router = Router();
  const controller = new AuthController();

  // Strict rate limit on auth endpoints: max 10 requests per minute per IP
  const strictAuthLimiter = rateLimiter({ windowSeconds: 60, maxRequests: 10, keyPrefix: 'ratelimit:auth' });

  router.post('/register', strictAuthLimiter, controller.register);
  router.post('/login', strictAuthLimiter, controller.login);
  router.post('/refresh-token', strictAuthLimiter, controller.refreshToken);
  router.post('/logout', authenticateJwt, controller.logout);

  return router;
};
