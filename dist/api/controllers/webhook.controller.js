"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const integration_service_1 = require("../../services/integration.service");
const webhook_engine_1 = require("../../integrations/webhooks/webhook-engine");
const logger_1 = require("../../monitoring/logger");
const zod_1 = require("zod");
const registerWebhookSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    targetUrl: zod_1.z.string().url(),
    subscribedEvents: zod_1.z.array(zod_1.z.string()).min(1),
});
class WebhookController {
    integrationService = new integration_service_1.IntegrationService();
    handleTwilioMessageStatus = async (req, res) => {
        const { MessageSid, MessageStatus, To, From, ErrorCode } = req.body;
        logger_1.logger.info({ MessageSid, MessageStatus, To, From, ErrorCode }, 'Received Twilio WhatsApp delivery status update');
        res.status(200).send('<Response></Response>');
    };
    handleTwilioVoiceStatus = async (req, res) => {
        const { CallSid, CallStatus, Duration, From, To } = req.body;
        logger_1.logger.info({ CallSid, CallStatus, Duration, From, To }, 'Received Twilio Voice call status update');
        res.status(200).send('<Response></Response>');
    };
    handleTwilioIVRCallback = async (req, res) => {
        const { Digits, CallSid } = req.body;
        logger_1.logger.info({ CallSid, Digits }, 'Received merchant DTMF keypad input');
        let twimlResponse = '';
        if (Digits === '1') {
            twimlResponse =
                '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<Response>\n' +
                    '    <Say voice="Polly.Aditi" language="hi-IN">धन्यवाद! आपका अभियान तुरंत स्वीकृत कर भेज दिया गया है।</Say>\n' +
                    '</Response>';
        }
        else {
            twimlResponse =
                '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<Response>\n' +
                    '    <Say voice="Polly.Aditi" language="hi-IN">ठीक है, अभियान अभी नहीं भेजा जाएगा। धन्यवाद।</Say>\n' +
                    '</Response>';
        }
        res.set('Content-Type', 'text/xml');
        res.status(200).send(twimlResponse);
    };
    registerWebhook = async (req, res, next) => {
        try {
            const data = registerWebhookSchema.parse(req.body);
            const sub = await this.integrationService.registerWebhook(data.merchantId, data.targetUrl, data.subscribedEvents);
            res.status(201).json({
                success: true,
                data: sub,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    getDeliveryLogs = async (req, res) => {
        const logs = webhook_engine_1.WebhookEngine.getDeliveryLogs();
        res.status(200).json({
            success: true,
            data: { logs, dlqCount: webhook_engine_1.WebhookEngine.getDLQCount() },
            meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
        });
    };
    replayDLQ = async (req, res) => {
        const index = parseInt(req.body.index || '0', 10);
        const success = await webhook_engine_1.WebhookEngine.replayDLQ(index);
        res.status(200).json({
            success,
            data: { message: success ? 'DLQ webhook replayed successfully' : 'DLQ index not found' },
        });
    };
}
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map