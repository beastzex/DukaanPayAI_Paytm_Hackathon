"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
class NotificationRepository {
    async insertNotification(params) {
        const query = `
      INSERT INTO notifications (
        merchant_id, channel, recipient, message_content, status, sent_at
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id
    `;
        const values = [
            params.merchantId,
            params.channel,
            params.recipient,
            params.messageContent,
            params.status,
        ];
        const result = await common_utils_1.DatabaseService.query(query, values);
        return result.rows[0].id;
    }
    async getMerchantNotifications(merchantId, limit = 20) {
        const query = `
      SELECT id, merchant_id as "merchantId", channel, recipient, 
             message_content as "messageContent", status, 
             sent_at as "sentAt", created_at as "createdAt"
      FROM notifications
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
        const result = await common_utils_1.DatabaseService.query(query, [merchantId, limit]);
        return result.rows;
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=NotificationRepository.js.map