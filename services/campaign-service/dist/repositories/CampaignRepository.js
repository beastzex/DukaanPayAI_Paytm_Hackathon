"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
class CampaignRepository {
    async createCampaign(params) {
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
        const result = await common_utils_1.DatabaseService.query(query, values);
        return result.rows[0];
    }
    async findById(id) {
        const query = `
      SELECT id, merchant_id as "merchantId", store_id as "storeId", 
             title, target_segment as "targetSegment", channel, 
             template_slug as "templateSlug", parameters, 
             approval_status as "approvalStatus", execution_status as "executionStatus", 
             scheduled_at as "scheduledAt", executed_at as "executedAt", created_at as "createdAt"
      FROM campaigns
      WHERE id = $1
    `;
        const result = await common_utils_1.DatabaseService.query(query, [id]);
        return result.rows[0] || null;
    }
    async updateApprovalStatus(id, status) {
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
        const result = await common_utils_1.DatabaseService.query(query, [status, id]);
        return result.rows[0] || null;
    }
    async recordExecution(id, recipientsCount, incrementalRevenue, cost) {
        const roi = cost > 0 ? Number((incrementalRevenue / cost).toFixed(2)) : 0;
        await common_utils_1.DatabaseService.transaction(async (client) => {
            await client.query(`UPDATE campaigns SET execution_status = 'COMPLETED', executed_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
            await client.query(`INSERT INTO campaign_results (
          campaign_id, recipients_targeted, messages_delivered, messages_read, 
          offers_redeemed, incremental_revenue, cost_incurred, roi_multiple
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                id,
                recipientsCount,
                Math.round(recipientsCount * 0.96),
                Math.round(recipientsCount * 0.82),
                Math.round(recipientsCount * 0.28),
                incrementalRevenue,
                cost,
                roi,
            ]);
        });
    }
    async getMerchantCampaigns(merchantId) {
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
        const result = await common_utils_1.DatabaseService.query(query, [merchantId]);
        return result.rows;
    }
}
exports.CampaignRepository = CampaignRepository;
//# sourceMappingURL=CampaignRepository.js.map