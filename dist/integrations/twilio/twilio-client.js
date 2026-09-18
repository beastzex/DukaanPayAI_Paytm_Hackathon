"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioClient = void 0;
const twilio_1 = __importDefault(require("twilio"));
const env_config_1 = require("../../configs/env.config");
const logger_1 = require("../../monitoring/logger");
class TwilioClient {
    static client = null;
    static initialize() {
        if (env_config_1.config.TWILIO_ACCOUNT_SID &&
            env_config_1.config.TWILIO_AUTH_TOKEN &&
            !env_config_1.config.TWILIO_ACCOUNT_SID.includes('placeholder')) {
            this.client = (0, twilio_1.default)(env_config_1.config.TWILIO_ACCOUNT_SID, env_config_1.config.TWILIO_AUTH_TOKEN);
            logger_1.logger.info('Twilio client initialized with production credentials');
        }
        else {
            logger_1.logger.info('Twilio client initialized in resilient simulated sandbox mode');
        }
    }
    /**
     * Sends an outbound WhatsApp message via Twilio WhatsApp API.
     */
    static async sendWhatsAppMessage(options) {
        const formattedRecipient = options.recipient.startsWith('whatsapp:')
            ? options.recipient
            : `whatsapp:${options.recipient}`;
        if (this.client) {
            try {
                const message = await this.client.messages.create({
                    from: env_config_1.config.TWILIO_WHATSAPP_NUMBER,
                    to: formattedRecipient,
                    body: options.messageText,
                    mediaUrl: options.mediaUrl,
                    statusCallback: options.statusCallbackUrl,
                });
                logger_1.logger.info({ sid: message.sid, status: message.status }, 'Twilio WhatsApp message dispatched');
                return {
                    providerMessageId: message.sid,
                    status: message.status,
                    direction: 'outbound-api',
                    price: message.price || undefined,
                };
            }
            catch (error) {
                logger_1.logger.error({ recipient: options.recipient, error }, 'Failed to dispatch Twilio WhatsApp message');
                throw error;
            }
        }
        // High-fidelity sandbox return for development
        const mockSid = `SM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        logger_1.logger.info({ recipient: formattedRecipient, mockSid }, '[Twilio Sandbox] WhatsApp message queued');
        return {
            providerMessageId: mockSid,
            status: 'queued',
            direction: 'outbound-api',
        };
    }
    /**
     * Initiates an outbound voice call via Twilio Voice API with Indic TwiML audio script.
     */
    static async initiateVoiceCall(options) {
        const twiml = options.twimlScript || this.generateDefaultVoiceTwiML();
        if (this.client) {
            try {
                const call = await this.client.calls.create({
                    from: env_config_1.config.TWILIO_VOICE_NUMBER,
                    to: options.recipient,
                    twiml,
                    statusCallback: options.statusCallbackUrl,
                    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
                });
                logger_1.logger.info({ callSid: call.sid, status: call.status }, 'Twilio Voice call initiated');
                return {
                    providerMessageId: call.sid,
                    status: call.status,
                    direction: 'outbound-api',
                };
            }
            catch (error) {
                logger_1.logger.error({ recipient: options.recipient, error }, 'Failed to initiate Twilio Voice call');
                throw error;
            }
        }
        const mockSid = `CA_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        logger_1.logger.info({ recipient: options.recipient, mockSid }, '[Twilio Sandbox] Voice call initiated');
        return {
            providerMessageId: mockSid,
            status: 'queued',
            direction: 'outbound-api',
        };
    }
    /**
     * Generates dynamic TwiML XML string for Indian Kirana audio interactions.
     */
    static generateDefaultVoiceTwiML(merchantName = 'व्यापारी जी', messageText = 'पेटीएम दुकानपे एआई में आपका स्वागत है। आपकी दैनिक बिक्री रिपोर्ट तैयार है।') {
        return (`<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<Response>\n` +
            `  <Say voice="Polly.Aditi" language="hi-IN">नमस्ते ${merchantName}। ${messageText}</Say>\n` +
            `  <Gather numDigits="1" action="/api/v1/webhooks/twilio/ivr-callback" method="POST">\n` +
            `    <Say voice="Polly.Aditi" language="hi-IN">स्वीकृति देने के लिए 1 दबाएं।</Say>\n` +
            `  </Gather>\n` +
            `</Response>`);
    }
}
exports.TwilioClient = TwilioClient;
//# sourceMappingURL=twilio-client.js.map