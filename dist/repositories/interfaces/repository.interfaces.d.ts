import { MerchantEntity, UserEntity, CampaignEntity, NotificationEntity, AuditLogEntity, WebhookSubscriptionEntity } from '../../domain/entities/entities';
export interface IMerchantRepository {
    findById(id: string): Promise<MerchantEntity | null>;
    findByPhone(phone: string): Promise<MerchantEntity | null>;
    create(merchant: Omit<MerchantEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<MerchantEntity>;
    update(id: string, updates: Partial<MerchantEntity>, expectedVersion: number): Promise<MerchantEntity>;
    delete(id: string): Promise<boolean>;
}
export interface IUserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<UserEntity>;
    update(id: string, updates: Partial<UserEntity>, expectedVersion: number): Promise<UserEntity>;
    delete(id: string): Promise<boolean>;
}
export interface ICampaignRepository {
    findById(id: string): Promise<CampaignEntity | null>;
    findByMerchantId(merchantId: string, limit?: number): Promise<CampaignEntity[]>;
    create(campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<CampaignEntity>;
    update(id: string, updates: Partial<CampaignEntity>, expectedVersion: number): Promise<CampaignEntity>;
}
export interface INotificationRepository {
    findById(id: string): Promise<NotificationEntity | null>;
    create(notification: Omit<NotificationEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<NotificationEntity>;
    updateStatus(id: string, status: string, providerRef?: string): Promise<boolean>;
}
export interface IAuditRepository {
    create(auditLog: Omit<AuditLogEntity, 'id' | 'createdAt'>): Promise<AuditLogEntity>;
    findByActorId(actorId: string, limit?: number): Promise<AuditLogEntity[]>;
}
export interface IWebhookRepository {
    findById(id: string): Promise<WebhookSubscriptionEntity | null>;
    findByMerchantId(merchantId: string): Promise<WebhookSubscriptionEntity[]>;
    create(sub: Omit<WebhookSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<WebhookSubscriptionEntity>;
    incrementFailure(id: string): Promise<void>;
}
//# sourceMappingURL=repository.interfaces.d.ts.map