"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationController = void 0;
const communication_service_1 = require("../../services/communication.service");
const entities_1 = require("../../domain/entities/entities");
const zod_1 = require("zod");
const sendWhatsAppSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    recipient: zod_1.z.string().min(10),
    content: zod_1.z.string().min(1),
    campaignId: zod_1.z.string().optional(),
    priority: zod_1.z.number().int().min(1).max(10).default(5),
});
const initiateVoiceSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    recipient: zod_1.z.string().min(10),
    merchantName: zod_1.z.string().optional(),
    twimlScript: zod_1.z.string().optional(),
});
class CommunicationController {
    commService = new communication_service_1.CommunicationService();
    sendWhatsApp = async (req, res, next) => {
        try {
            const data = sendWhatsAppSchema.parse(req.body);
            const result = await this.commService.sendWhatsAppMessage({
                ...data,
                channel: entities_1.NotificationChannel.WHATSAPP,
            });
            res.status(200).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    initiateCall = async (req, res, next) => {
        try {
            const data = initiateVoiceSchema.parse(req.body);
            const result = await this.commService.initiateVoiceCall(data);
            res.status(200).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.CommunicationController = CommunicationController;
//# sourceMappingURL=communication.controller.js.map