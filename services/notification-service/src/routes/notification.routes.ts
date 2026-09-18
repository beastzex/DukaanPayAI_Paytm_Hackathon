import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';

export const createNotificationRouter = (): Router => {
  const router = Router();
  const controller = new NotificationController();

  router.post('/whatsapp/send', controller.sendWhatsApp);
  router.post('/voice/trigger', controller.triggerVoice);

  return router;
};
