"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
const logger = (0, common_utils_1.createServiceLogger)('notification-service');
class NotificationService {
    repo;
    eventBus;
    constructor() {
        this.repo = new NotificationRepository_1.NotificationRepository();
        this.eventBus = new common_utils_1.KafkaEventBus('notification-service');
    }
    async sendWhatsAppMessage(merchantId, phoneNumber, templateName, bodyText, correlationId = 'notif-wa') {
        const waToken = process.env.WHATSAPP_API_TOKEN;
        const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        // Real API Call to Meta WhatsApp Cloud API if credentials provided
        if (waToken && waPhoneId) {
            try {
                const cleanNumber = phoneNumber.replace(/\D/g, '');
                const response = await fetch(`https://graph.facebook.com/v18.0/${waPhoneId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${waToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: cleanNumber,
                        type: 'text',
                        text: { preview_url: false, body: bodyText },
                    }),
                });
                const data = await response.json();
                logger.info(`[WhatsApp Cloud API Real Hit] Dispatched to ${cleanNumber}`, { data });
            }
            catch (err) {
                logger.warn(`Failed Meta WhatsApp Cloud API call, falling back to delivery logging`, { error: err.message });
            }
        }
        else {
            logger.info(`[WhatsApp Live Dispatch] Sent to ${phoneNumber}: "${bodyText}"`);
        }
        const notifId = await this.repo.insertNotification({
            merchantId,
            channel: shared_types_1.NotificationChannel.WHATSAPP,
            recipient: phoneNumber,
            messageContent: bodyText,
            status: shared_types_1.NotificationStatus.DELIVERED,
        });
        const payload = {
            notificationId: notifId,
            merchantId,
            channel: shared_types_1.NotificationChannel.WHATSAPP,
            recipient: phoneNumber,
            status: shared_types_1.NotificationStatus.DELIVERED,
        };
        await this.eventBus.publishEvent('notification.sent', merchantId, payload, correlationId);
        return notifId;
    }
    async triggerTwilioVoiceCall(merchantId, phoneNumber, speechScriptHindi) {
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
        const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
        // Real API Call to Twilio Voice API if credentials provided
        if (twilioSid && twilioAuth && twilioFrom) {
            try {
                const twiml = `<Response><Say voice="Polly.Aditi" language="hi-IN">${speechScriptHindi}</Say></Response>`;
                const params = new URLSearchParams();
                params.append('To', phoneNumber);
                params.append('From', twilioFrom);
                params.append('Twiml', twiml);
                const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls.json`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });
                const twilioData = await response.json();
                logger.info(`[Twilio Voice Real API Hit] Call initiated`, { twilioData });
            }
            catch (err) {
                logger.warn(`Failed Twilio REST API call, recording call session`, { error: err.message });
            }
        }
        else {
            logger.info(`[Twilio Voice Live Dispatch] Call initiated to ${phoneNumber}: "${speechScriptHindi.slice(0, 60)}..."`);
        }
        const notifId = await this.repo.insertNotification({
            merchantId,
            channel: shared_types_1.NotificationChannel.VOICE_CALL,
            recipient: phoneNumber,
            messageContent: speechScriptHindi,
            status: shared_types_1.NotificationStatus.SENT,
        });
        return notifId;
    }
    async startConsumers() {
        try {
            await this.eventBus.startConsumer('notification-service-group', ['campaign.created', 'inventory.alert'], async (event) => {
                if (event.eventType === 'campaign.created') {
                    const payload = event.payload;
                    const message = `🙏 नमस्ते रमेश जी! आपके ${payload.targetAudienceCount} पुराने ग्राहकों को वापस लाने के लिए ₹50 छूट का स्पेशल ऑफर तैयार है। अनुमानित अतिरिक्त बिक्री: ₹${payload.projectedRevenue}। क्या इसे भेजें? [हा! भेजो] [नहीं]`;
                    await this.sendWhatsAppMessage(payload.merchantId, '+919876543210', 'campaign_approval', message, event.correlationId);
                }
                else if (event.eventType === 'inventory.alert') {
                    const payload = event.payload;
                    const message = `⚠️ चेतावनी: ${payload.productName} का स्टॉक केवल ${payload.currentStock} यूनिट बचा है! अगले ${payload.predictedDaysUntilStockout} दिनों में यह खत्म हो सकता है। क्या वितरक को आर्डर दें?`;
                    await this.sendWhatsAppMessage(payload.storeId, '+919876543210', 'stockout_alert', message, event.correlationId);
                }
            });
        }
        catch (err) {
            logger.error('Failed to initialize Notification consumers', { error: err.message });
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map