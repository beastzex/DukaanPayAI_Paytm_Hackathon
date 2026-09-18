import { DatabaseService } from '@dukaanpay/common-utils';
import { Campaign, CampaignStatus, NotificationChannel } from '@dukaanpay/shared-types';

export interface CreateCampaignParams {
  merchantId: string;
  storeId: string;
  title: string;
  targetSegment: string;
  channel: NotificationChannel;
  templateSlug: string;
  parameters: any;
  scheduledAt?: Date;
}

export interface CampaignResultDetail {
  campaign: Campaign;
  recipientsTargeted: number;
  messagesDelivered: number;
  messagesRead: number;
  offersRedeemed: number;
  incrementalRevenue: number;
  costIncurred: number;
  roiMultiple: number;
}

export class CampaignRepository {
  public async createCampaign(params: CreateCampaignParams): Promise<Campaign> {
    const query = `
      INSERT INTO campaigns (
        merchant_id, store_id, title, target_segment, channel, 
        template_slug, parameters, approval_status, execution_status, scheduled_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING_APPROVAL', 'NOT_STARTED', $8)
      RETURNING id, merchant_id as "merchantId", store_id as "storeId", 
                title, target_segment as "targetSegment", channel, 
                template_slug as "templateSlug", parameters, 
                approval_status as "approvalStatus", execution_status as "executionStatus", 
                scheduled_at as "scheduledAt", created_at as "createdAt"
    `;
    const values = [
      params.merchantId,
      params.storeId,
      params.title,
      params.targetSegment,
      params.channel,
      params.templateSlug,
      JSON.stringify(params.parameters),
      params.scheduledAt || null,
    ];
    const result = await DatabaseService.query<Campaign>(query, values);
    return result.rows[0];
  }

  public async findById(id: string): Promise<Campaign | null> {
    const query = `
      SELECT id, merchant_id as "merchantId", store_id as "storeId", 
             title, target_segment as "targetSegment", channel, 
             template_slug as "templateSlug", parameters, 
             approval_status as "approvalStatus", execution_status as "executionStatus", 
             scheduled_at as "scheduledAt", executed_at as "executedAt", created_at as "createdAt"
      FROM campaigns
      WHERE id = $1
    `;
    const result = await DatabaseService.query<Campaign>(query, [id]);
    return result.rows[0] || null;
  }

  public async updateApprovalStatus(
    id: string,
    status: CampaignStatus
  ): Promise<Campaign | null> {
    const query = `
      UPDATE campaigns
      SET approval_status = $1, 
          execution_status = CASE WHEN $1 = 'APPROVED' THEN 'IN_PROGRESS' ELSE 'REJECTED' END
      WHERE id = $2
      RETURNING id, merchant_id as "merchantId", store_id as "storeId", 
                title, target_segment as "targetSegment", channel, 
                template_slug as "templateSlug", parameters, 
                approval_status as "approvalStatus", execution_status as "executionStatus", 
                scheduled_at as "scheduledAt", executed_at as "executedAt", created_at as "createdAt"
    `;
    const result = await DatabaseService.query<Campaign>(query, [status, id]);
    return result.rows[0] || null;
  }

  public async recordExecution(
    id: string,
    recipientsCount: number,
    incrementalRevenue: number,
    cost: number
  ): Promise<void> {
    const roi = cost > 0 ? Number((incrementalRevenue / cost).toFixed(2)) : 0;

    await DatabaseService.transaction(async (client) => {
      await client.query(
        `UPDATE campaigns SET execution_status = 'COMPLETED', executed_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );

      await client.query(
        `INSERT INTO campaign_results (
          campaign_id, recipients_targeted, messages_delivered, messages_read, 
          offers_redeemed, incremental_revenue, cost_incurred, roi_multiple
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          recipientsCount,
          Math.round(recipientsCount * 0.96),
          Math.round(recipientsCount * 0.82),
          Math.round(recipientsCount * 0.28),
          incrementalRevenue,
          cost,
          roi,
        ]
      );
    });
  }

  public async getMerchantCampaigns(merchantId: string): Promise<Campaign[]> {
    const query = `
      SELECT id, merchant_id as "merchantId", store_id as "storeId", 
             title, target_segment as "targetSegment", channel, 
             template_slug as "templateSlug", parameters, 
             approval_status as "approvalStatus", execution_status as "executionStatus", 
             scheduled_at as "scheduledAt", executed_at as "executedAt", created_at as "createdAt"
      FROM campaigns
      WHERE merchant_id = $1
      ORDER BY created_at DESC
    `;
    const result = await DatabaseService.query<Campaign>(query, [merchantId]);
    return result.rows;
  }
}
