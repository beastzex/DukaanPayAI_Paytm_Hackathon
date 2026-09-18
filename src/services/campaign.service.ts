import { PostgresCampaignRepository } from '../repositories/postgres/postgres-repositories';
import { CampaignEntity, CampaignStatus, NotificationChannel } from '../domain/entities/entities';
import { KafkaEventBus, KAFKA_TOPICS } from '../events/kafka-client';
import { QueueManager, QUEUE_NAMES } from '../workers/queue-manager';
import { DistributedLock } from '../infrastructure/redis/distributed-lock';
import { EntityNotFoundException } from '../domain/exceptions/domain-exceptions';
import { logger } from '../monitoring/logger';

export interface CreateCampaignDto {
  merchantId: string;
  title: string;
  targetSegment: string;
  channel?: NotificationChannel;
  templateSlug: string;
  templateParameters: Record<string, any>;
  scheduledAt?: Date;
  audienceCount: number;
}

export class CampaignService {
  private campaignRepo = new PostgresCampaignRepository();

  public async createCampaign(dto: CreateCampaignDto): Promise<CampaignEntity> {
    const campaign = await this.campaignRepo.create({
      merchantId: dto.merchantId,
      title: dto.title,
      targetSegment: dto.targetSegment,
      channel: dto.channel || NotificationChannel.WHATSAPP,
      templateSlug: dto.templateSlug,
      templateParameters: dto.templateParameters,
      scheduledAt: dto.scheduledAt,
      status: CampaignStatus.DRAFT,
      audienceCount: dto.audienceCount,
      deliveredCount: 0,
      failedCount: 0,
    });

    await KafkaEventBus.publish(
      KAFKA_TOPICS.CAMPAIGN_CREATED,
      dto.merchantId,
      {
        campaignId: campaign.id,
        merchantId: dto.merchantId,
        title: dto.title,
      }
    );

    logger.info({ campaignId: campaign.id }, 'Campaign drafted and persisted');
    return campaign;
  }

  public async triggerExecution(campaignId: string): Promise<CampaignEntity> {
    const lockKey = `campaign:execution:${campaignId}`;

    return DistributedLock.withLock(
      lockKey,
      async () => {
        const campaign = await this.campaignRepo.findById(campaignId);
        if (!campaign) {
          throw new EntityNotFoundException('Campaign', campaignId);
        }

        // Update status to PROCESSING with optimistic lock
        const updated = await this.campaignRepo.update(
          campaignId,
          { status: CampaignStatus.PROCESSING },
          campaign.version
        );

        // Publish to Kafka
        await KafkaEventBus.publish(
          KAFKA_TOPICS.CAMPAIGN_STARTED,
          campaign.merchantId,
          {
            campaignId: campaign.id,
            audienceCount: campaign.audienceCount,
          }
        );

        // Offload execution to BullMQ queue
        await QueueManager.enqueue(
          QUEUE_NAMES.CAMPAIGN,
          'execute_campaign_blast',
          {
            campaignId: campaign.id,
            merchantId: campaign.merchantId,
            audienceCount: campaign.audienceCount,
          }
        );

        // Simulated batch progress
        await this.campaignRepo.update(
          campaignId,
          {
            status: CampaignStatus.COMPLETED,
            deliveredCount: campaign.audienceCount,
          },
          updated.version
        );

        await KafkaEventBus.publish(
          KAFKA_TOPICS.CAMPAIGN_COMPLETED,
          campaign.merchantId,
          {
            campaignId: campaign.id,
            deliveredCount: campaign.audienceCount,
          }
        );

        logger.info({ campaignId }, 'Campaign executed successfully');
        return campaign;
      },
      60 // 60-second lock
    );
  }

  public async getCampaigns(merchantId: string): Promise<CampaignEntity[]> {
    return this.campaignRepo.findByMerchantId(merchantId);
  }
}
