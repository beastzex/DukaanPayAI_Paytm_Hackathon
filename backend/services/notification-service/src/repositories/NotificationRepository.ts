import { DatabaseService } from '@dukaanpay/common-utils';
import { NotificationChannel, NotificationStatus } from '@dukaanpay/shared-types';

export interface InsertNotificationParams {
  merchantId: string;
  channel: NotificationChannel;
  recipient: string;
  messageContent: string;
  status: NotificationStatus;
}

export class NotificationRepository {
  public async insertNotification(params: InsertNotificationParams): Promise<string> {
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
    const result = await DatabaseService.query(query, values);
    return result.rows[0].id;
  }

  public async getMerchantNotifications(merchantId: string, limit = 20): Promise<any[]> {
    const query = `
      SELECT id, merchant_id as "merchantId", channel, recipient, 
             message_content as "messageContent", status, 
             sent_at as "sentAt", created_at as "createdAt"
      FROM notifications
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await DatabaseService.query(query, [merchantId, limit]);
    return result.rows;
  }
}
