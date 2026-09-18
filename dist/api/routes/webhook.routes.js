"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookRouter = void 0;
const express_1 = require("express");
const webhook_controller_1 = require("../controllers/webhook.controller");
const twilio_webhook_validator_1 = require("../../integrations/twilio/twilio-webhook-validator");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const createWebhookRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new webhook_controller_1.WebhookController();
    // Twilio sends urlencoded form-data for webhooks
    router.use('/twilio', (0, express_1.urlencoded)({ extended: false }));
    // Twilio Voice & WhatsApp callbacks (protected by Twilio HMAC signature verification)
    router.post('/twilio/message-status', twilio_webhook_validator_1.TwilioWebhookValidator.validate, controller.handleTwilioMessageStatus);
    router.post('/twilio/voice-status', twilio_webhook_validator_1.TwilioWebhookValidator.validate, controller.handleTwilioVoiceStatus);
    router.post('/twilio/ivr-callback', twilio_webhook_validator_1.TwilioWebhookValidator.validate, controller.handleTwilioIVRCallback);
    // Generic Webhook Subscription Management
    router.post('/subscriptions', auth_middleware_1.authenticateJwt, controller.registerWebhook);
    router.get('/logs', auth_middleware_1.authenticateJwt, controller.getDeliveryLogs);
    router.post('/dlq/replay', auth_middleware_1.authenticateJwt, controller.replayDLQ);
    return router;
};
exports.createWebhookRouter = createWebhookRouter;
//# sourceMappingURL=webhook.routes.js.map