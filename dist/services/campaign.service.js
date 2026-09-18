"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const postgres_repositories_1 = require("../repositories/postgres/postgres-repositories");
const entities_1 = require("../domain/entities/entities");
const kafka_client_1 = require("../events/kafka-client");
const queue_manager_1 = require("../workers/queue-manager");
const distributed_lock_1 = require("../infrastructure/redis/distributed-lock");
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const logger_1 = require("../monitoring/logger");
class CampaignService {
    campaignRepo = new postgres_repositories_1.PostgresCampaignRepository();
    async createCampaign(dto) {
        const campaign = await this.campaignRepo.create({
            merchantId: dto.merchantId,
            title: dto.title,
            targetSegment: dto.targetSegment,
            channel: dto.channel || entities_1.NotificationChannel.WHATSAPP,
            templateSlug: dto.templateSlug,
            templateParameters: dto.templateParameters,
            scheduledAt: dto.scheduledAt,
            status: entities_1.CampaignStatus.DRAFT,
            audienceCount: dto.audienceCount,
            deliveredCount: 0,
            failedCount: 0,
        });
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.CAMPAIGN_CREATED, dto.merchantId, {
            campaignId: campaign.id,
            merchantId: dto.merchantId,
            title: dto.title,
        });
        logger_1.logger.info({ campaignId: campaign.id }, 'Campaign drafted and persisted');
        return campaign;
    }
    async triggerExecution(campaignId) {
        const lockKey = `campaign:execution:${campaignId}`;
        return distributed_lock_1.DistributedLock.withLock(lockKey, async () => {
            const campaign = await this.campaignRepo.findById(campaignId);
            if (!campaign) {
                throw new domain_exceptions_1.EntityNotFoundException('Campaign', campaignId);
            }
            // Update status to PROCESSING with optimistic lock
            const updated = await this.campaignRepo.update(campaignId, { status: entities_1.CampaignStatus.PROCESSING }, campaign.version);
            // Publish to Kafka
            await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.CAMPAIGN_STARTED, campaign.merchantId, {
                campaignId: campaign.id,
                audienceCount: campaign.audienceCount,
            });
            // Offload execution to BullMQ queue
            await queue_manager_1.QueueManager.enqueue(queue_manager_1.QUEUE_NAMES.CAMPAIGN, 'execute_campaign_blast', {
                campaignId: campaign.id,
                merchantId: campaign.merchantId,
                audienceCount: campaign.audienceCount,
            });
            // Simulated batch progress
            await this.campaignRepo.update(campaignId, {
                status: entities_1.CampaignStatus.COMPLETED,
                deliveredCount: campaign.audienceCount,
            }, updated.version);
            await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.CAMPAIGN_COMPLETED, campaign.merchantId, {
                campaignId: campaign.id,
                deliveredCount: campaign.audienceCount,
            });
            logger_1.logger.info({ campaignId }, 'Campaign executed successfully');
            return campaign;
        }, 60 // 60-second lock
        );
    }
    async getCampaigns(merchantId) {
        return this.campaignRepo.findByMerchantId(merchantId);
    }
}
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map