"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaign_service_1 = require("../../services/campaign.service");
const zod_1 = require("zod");
const createCampaignSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    title: zod_1.z.string().min(3),
    targetSegment: zod_1.z.string(),
    channel: zod_1.z.enum(['WHATSAPP', 'VOICE', 'SMS', 'EMAIL']).default('WHATSAPP'),
    templateSlug: zod_1.z.string(),
    templateParameters: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).default({}),
    scheduledAt: zod_1.z.string().datetime().optional(),
    audienceCount: zod_1.z.number().int().min(1),
});
class CampaignController {
    campaignService = new campaign_service_1.CampaignService();
    create = async (req, res, next) => {
        try {
            const data = createCampaignSchema.parse(req.body);
            const campaign = await this.campaignService.createCampaign({
                ...data,
                channel: data.channel,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
            });
            res.status(201).json({
                success: true,
                data: campaign,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    execute = async (req, res, next) => {
        try {
            const campaignId = req.params.id;
            const campaign = await this.campaignService.triggerExecution(campaignId);
            res.status(200).json({
                success: true,
                data: campaign,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    listByMerchant = async (req, res, next) => {
        try {
            const merchantId = req.params.merchantId;
            const campaigns = await this.campaignService.getCampaigns(merchantId);
            res.status(200).json({
                success: true,
                data: campaigns,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map