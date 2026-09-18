"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
const common_utils_1 = require("@dukaanpay/common-utils");
class NotificationController {
    service;
    constructor() {
        this.service = new NotificationService_1.NotificationService();
    }
    sendWhatsApp = async (req, res, next) => {
        try {
            const { merchantId, phoneNumber, templateName, bodyText } = req.body;
            if (!merchantId || !phoneNumber || !bodyText) {
                throw new common_utils_1.ValidationError('merchantId, phoneNumber, and bodyText required');
            }
            const notifId = await this.service.sendWhatsAppMessage(merchantId, phoneNumber, templateName || 'custom', bodyText, req.headers['x-correlation-id'] || 'notif-send');
            const response = {
                success: true,
                data: { notificationId: notifId },
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    triggerVoice = async (req, res, next) => {
        try {
            const { merchantId, phoneNumber, speechScriptHindi } = req.body;
            if (!merchantId || !phoneNumber || !speechScriptHindi) {
                throw new common_utils_1.ValidationError('merchantId, phoneNumber, and speechScriptHindi required');
            }
            const callId = await this.service.triggerTwilioVoiceCall(merchantId, phoneNumber, speechScriptHindi);
            res.status(200).json({
                success: true,
                data: { callId },
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map