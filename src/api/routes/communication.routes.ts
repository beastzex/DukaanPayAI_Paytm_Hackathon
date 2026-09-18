import { Router } from 'express';
import { CommunicationController } from '../controllers/communication.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { idempotencyMiddleware } from '../../middleware/idempotency.middleware';

export const createCommunicationRouter = (): Router => {
  const router = Router();
  const controller = new CommunicationController();

  router.post('/whatsapp/send', authenticateJwt, controller.sendWhatsApp);
  router.post('/voice/call', authenticateJwt, controller.initiateCall);

  return router;
};
