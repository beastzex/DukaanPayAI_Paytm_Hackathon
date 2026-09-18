import { NotificationChannel, NotificationStatus } from '@dukaanpay/shared-types';
export interface InsertNotificationParams {
    merchantId: string;
    channel: NotificationChannel;
    recipient: string;
    messageContent: string;
    status: NotificationStatus;
}
export declare class NotificationRepository {
    insertNotification(params: InsertNotificationParams): Promise<string>;
    getMerchantNotifications(merchantId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=NotificationRepository.d.ts.map