import { Router, urlencoded } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { TwilioWebhookValidator } from '../../integrations/twilio/twilio-webhook-validator';
import { authenticateJwt } from '../../middleware/auth.middleware';

export const createWebhookRouter = (): Router => {
  const router = Router();
  const controller = new WebhookController();

  // Twilio sends urlencoded form-data for webhooks
  router.use('/twilio', urlencoded({ extended: false }));

  // Twilio Voice & WhatsApp callbacks (protected by Twilio HMAC signature verification)
  router.post('/twilio/message-status', TwilioWebhookValidator.validate, controller.handleTwilioMessageStatus);
  router.post('/twilio/voice-status', TwilioWebhookValidator.validate, controller.handleTwilioVoiceStatus);
  router.post('/twilio/ivr-callback', TwilioWebhookValidator.validate, controller.handleTwilioIVRCallback);

  // Generic Webhook Subscription Management
  router.post('/subscriptions', authenticateJwt, controller.registerWebhook);
  router.get('/logs', authenticateJwt, controller.getDeliveryLogs);
  router.post('/dlq/replay', authenticateJwt, controller.replayDLQ);

  return router;
};
