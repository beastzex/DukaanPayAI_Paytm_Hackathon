"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioWebhookValidator = void 0;
const twilio_1 = __importDefault(require("twilio"));
const env_config_1 = require("../../configs/env.config");
const logger_1 = require("../../monitoring/logger");
class TwilioWebhookValidator {
    /**
     * Middleware to validate Twilio X-Twilio-Signature on incoming Webhooks and callbacks.
     * Rejects forged or unsigned requests with 401 Unauthorized.
     */
    static validate(req, res, next) {
        // In local development with placeholder tokens, allow bypass with warning
        if (env_config_1.config.NODE_ENV === 'development' && env_config_1.config.TWILIO_AUTH_TOKEN.includes('placeholder')) {
            logger_1.logger.debug('Skipping Twilio signature check in local placeholder mode');
            return next();
        }
        const signature = req.headers['x-twilio-signature'];
        if (!signature) {
            logger_1.logger.warn({ ip: req.ip, path: req.path }, 'Rejected Twilio webhook: Missing X-Twilio-Signature header');
            res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED_WEBHOOK', message: 'Missing X-Twilio-Signature header' },
            });
            return;
        }
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const params = req.body || {};
        const isValid = twilio_1.default.validateRequest(env_config_1.config.TWILIO_AUTH_TOKEN, signature, fullUrl, params);
        if (!isValid) {
            logger_1.logger.warn({ ip: req.ip, signature, url: fullUrl }, 'Rejected Twilio webhook: Invalid cryptographic signature');
            res.status(401).json({
                success: false,
                error: { code: 'FORGED_WEBHOOK_SIGNATURE', message: 'Cryptographic signature verification failed' },
            });
            return;
        }
        logger_1.logger.debug('Twilio webhook signature verified successfully');
        next();
    }
}
exports.TwilioWebhookValidator = TwilioWebhookValidator;
//# sourceMappingURL=twilio-webhook-validator.js.map