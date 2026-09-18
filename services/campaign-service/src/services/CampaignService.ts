import { CampaignRepository } from '../repositories/CampaignRepository';
import { KafkaEventBus, createServiceLogger } from '@dukaanpay/common-utils';
import { DraftCampaignInput, ApproveCampaignInput } from '@dukaanpay/shared-validators';
import {
  Campaign,
  CampaignStatus,
  NotificationChannel,
  CampaignCreatedPayload,
  CampaignExecutedPayload,
} from '@dukaanpay/shared-types';
import { NotFoundError } from '@dukaanpay/common-utils';

const logger = createServiceLogger('campaign-service');

export class CampaignService {
  private repo: CampaignRepository;
  private eventBus: KafkaEventBus;

  constructor() {
    this.repo = new CampaignRepository();
    this.eventBus = new KafkaEventBus('campaign-service');
  }

  public async draftCampaign(
    merchantId: string,
    input: DraftCampaignInput,
    correlationId = 'campaign-draft'
  ): Promise<Campaign> {
    const campaign = await this.repo.createCampaign({
      merchantId,
      storeId: input.storeId,
      title: input.title,
      targetSegment: input.targetSegment,
      channel: NotificationChannel.WHATSAPP,
      templateSlug: input.templateSlug,
      parameters: input.parameters,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    });

    const audienceEstimate = input.targetSegment === 'CHURN_RISK_HIGH' ? 45 : 120;
    const projectedRevenue = audienceEstimate * 380 * 0.35; // 35% conversion @ ₹380 basket

    // Publish campaign.created to notify WhatsApp approval dispatcher
    const payload: CampaignCreatedPayload = {
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

  public async handleApproval(
    input: ApproveCampaignInput,
    correlationId = 'campaign-approval'
  ): Promise<Campaign> {
    const existing = await this.repo.findById(input.campaignId);
    if (!existing) {
      throw new NotFoundError('Campaign');
    }

    const newStatus =
      input.approvalStatus === 'APPROVED' ? CampaignStatus.APPROVED : CampaignStatus.REJECTED;

    const updated = await this.repo.updateApprovalStatus(input.campaignId, newStatus);
    if (!updated) {
      throw new NotFoundError('Campaign update');
    }

    if (newStatus === CampaignStatus.APPROVED) {
      // Simulate real-time campaign dispatch
      const audienceCount = 50;
      const incrementalRev = 14500.0;
      const cost = audienceCount * 0.40; // 40p per WhatsApp message

      await this.repo.recordExecution(input.campaignId, audienceCount, incrementalRev, cost);

      const payload: CampaignExecutedPayload = {
        campaignId: updated.id,
        merchantId: updated.merchantId,
        dispatchedCount: audienceCount,
        timestamp: new Date().toISOString(),
      };

      await this.eventBus.publishEvent(
        'campaign.executed',
        updated.merchantId,
        payload,
        correlationId
      );
      logger.info(`Campaign executed successfully with 1-tap approval: ${updated.id}`);
    }

    return updated;
  }

  public async getMerchantCampaigns(merchantId: string): Promise<Campaign[]> {
    return this.repo.getMerchantCampaigns(merchantId);
  }
}
