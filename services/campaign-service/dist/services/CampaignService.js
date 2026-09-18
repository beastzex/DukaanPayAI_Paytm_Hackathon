"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const CampaignRepository_1 = require("../repositories/CampaignRepository");
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
const common_utils_2 = require("@dukaanpay/common-utils");
const logger = (0, common_utils_1.createServiceLogger)('campaign-service');
class CampaignService {
    repo;
    eventBus;
    constructor() {
        this.repo = new CampaignRepository_1.CampaignRepository();
        this.eventBus = new common_utils_1.KafkaEventBus('campaign-service');
    }
    async draftCampaign(merchantId, input, correlationId = 'campaign-draft') {
        const campaign = await this.repo.createCampaign({
            merchantId,
            storeId: input.storeId,
            title: input.title,
            targetSegment: input.targetSegment,
            channel: shared_types_1.NotificationChannel.WHATSAPP,
            templateSlug: input.templateSlug,
            parameters: input.parameters,
            scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        });
        const audienceEstimate = input.targetSegment === 'CHURN_RISK_HIGH' ? 45 : 120;
        const projectedRevenue = audienceEstimate * 380 * 0.35; // 35% conversion @ ₹380 basket
        // Publish campaign.created to notify WhatsApp approval dispatcher
        const payload = {
            campaignId: campaign.id,
            merchantId,
            title: campaign.title,
            targetAudienceCount: audienceEstimate,
            projectedRevenue,
        };
        await this.eventBus.publishEvent('campaign.created', merchantId, payload, correlationId);
        logger.info(`Campaign drafted and queued for merchant approval: ${campaign.id}`);
        return campaign;
    }
    async handleApproval(input, correlationId = 'campaign-approval') {
        const existing = await this.repo.findById(input.campaignId);
        if (!existing) {
            throw new common_utils_2.NotFoundError('Campaign');
        }
        const newStatus = input.approvalStatus === 'APPROVED' ? shared_types_1.CampaignStatus.APPROVED : shared_types_1.CampaignStatus.REJECTED;
        const updated = await this.repo.updateApprovalStatus(input.campaignId, newStatus);
        if (!updated) {
            throw new common_utils_2.NotFoundError('Campaign update');
        }
        if (newStatus === shared_types_1.CampaignStatus.APPROVED) {
            // Simulate real-time campaign dispatch
            const audienceCount = 50;
            const incrementalRev = 14500.0;
            const cost = audienceCount * 0.40; // 40p per WhatsApp message
            await this.repo.recordExecution(input.campaignId, audienceCount, incrementalRev, cost);
            const payload = {
                campaignId: updated.id,
                merchantId: updated.merchantId,
                dispatchedCount: audienceCount,
                timestamp: new Date().toISOString(),
            };
            await this.eventBus.publishEvent('campaign.executed', updated.merchantId, payload, correlationId);
            logger.info(`Campaign executed successfully with 1-tap approval: ${updated.id}`);
        }
        return updated;
    }
    async getMerchantCampaigns(merchantId) {
        return this.repo.getMerchantCampaigns(merchantId);
    }
}
exports.CampaignService = CampaignService;
//# sourceMappingURL=CampaignService.js.map