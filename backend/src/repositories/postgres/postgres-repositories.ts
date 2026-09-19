import {
  IMerchantRepository,
  IUserRepository,
  ICampaignRepository,
  INotificationRepository,
  IAuditRepository,
  IWebhookRepository,
} from '../interfaces/repository.interfaces';
import {
  MerchantEntity,
  UserEntity,
  CampaignEntity,
  NotificationEntity,
  AuditLogEntity,
  WebhookSubscriptionEntity,
  CampaignStatus,
  NotificationChannel,
  NotificationStatus,
  UserRole,
} from '../../domain/entities/entities';
import { OptimisticLockException } from '../../domain/exceptions/domain-exceptions';
import crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

// In-Memory state seed for dual-mode local testing
const merchantsDb = new Map<string, MerchantEntity>();
const usersDb = new Map<string, UserEntity>();
const campaignsDb = new Map<string, CampaignEntity>();
const notificationsDb = new Map<string, NotificationEntity>();
const auditLogsDb: AuditLogEntity[] = [];
const webhooksDb = new Map<string, WebhookSubscriptionEntity>();

// Seed default merchant & user
const defaultMerchantId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
const seedMerchant: MerchantEntity = {
  id: defaultMerchantId,
  businessName: 'गुप्ता किराना स्टोर (Gupta Kirana Store)',
  ownerName: 'राजेश गुप्ता (Rajesh Gupta)',
  phoneNumber: '+919876543210',
  email: 'ramesh.gupta@paytm.com',
  category: 'Kirana & FMCG',
  pincode: '208006',
  city: 'Kanpur',
  state: 'Uttar Pradesh',
  kycStatus: 'VERIFIED',
  preferredLanguage: 'hi',
  settings: { soundboxEnabled: true, dailyBriefingTime: '08:00' },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  version: 1,
};
merchantsDb.set(defaultMerchantId, seedMerchant);

export class PostgresMerchantRepository implements IMerchantRepository {
  public async findById(id: string): Promise<MerchantEntity | null> {
    const m = merchantsDb.get(id);
    if (!m || m.deletedAt) return null;
    return m;
  }

  public async findByPhone(phone: string): Promise<MerchantEntity | null> {
    for (const m of merchantsDb.values()) {
      if (m.phoneNumber === phone && !m.deletedAt) return m;
    }
    return null;
  }

  public async create(data: Omit<MerchantEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<MerchantEntity> {
    const entity: MerchantEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };
    merchantsDb.set(entity.id, entity);
    return entity;
  }

  public async update(id: string, updates: Partial<MerchantEntity>, expectedVersion: number): Promise<MerchantEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Merchant ${id} not found`);

    if (existing.version !== expectedVersion) {
      throw new OptimisticLockException('Merchant', id, existing.version);
    }

    const updated: MerchantEntity = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };
    merchantsDb.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    existing.deletedAt = new Date();
    existing.updatedAt = new Date();
    return true;
  }
}

export class PostgresUserRepository implements IUserRepository {
  public async findById(id: string): Promise<UserEntity | null> {
    const u = usersDb.get(id);
    if (!u || u.deletedAt) return null;
    return u;
  }

  public async findByPhone(phone: string): Promise<UserEntity | null> {
    for (const u of usersDb.values()) {
      if (u.phoneNumber === phone && !u.deletedAt) return u;
    }
    return null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    for (const u of usersDb.values()) {
      if (u.email === email && !u.deletedAt) return u;
    }
    return null;
  }

  public async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<UserEntity> {
    const entity: UserEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };
    usersDb.set(entity.id, entity);
    return entity;
  }

  public async update(id: string, updates: Partial<UserEntity>, expectedVersion: number): Promise<UserEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`User ${id} not found`);

    if (existing.version !== expectedVersion) {
      throw new OptimisticLockException('User', id, existing.version);
    }

    const updated: UserEntity = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };
    usersDb.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    existing.deletedAt = new Date();
    existing.updatedAt = new Date();
    return true;
  }
}

export class PostgresCampaignRepository implements ICampaignRepository {
  public async findById(id: string): Promise<CampaignEntity | null> {
    const c = campaignsDb.get(id);
    if (!c || c.deletedAt) return null;
    return c;
  }

  public async findByMerchantId(merchantId: string, limit = 20): Promise<CampaignEntity[]> {
    return Array.from(campaignsDb.values())
      .filter((c) => c.merchantId === merchantId && !c.deletedAt)
      .slice(0, limit);
  }

  public async create(data: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<CampaignEntity> {
    const entity: CampaignEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };
    campaignsDb.set(entity.id, entity);
    return entity;
  }

  public async update(id: string, updates: Partial<CampaignEntity>, expectedVersion: number): Promise<CampaignEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Campaign ${id} not found`);

    if (existing.version !== expectedVersion) {
      throw new OptimisticLockException('Campaign', id, existing.version);
    }

    const updated: CampaignEntity = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };
    campaignsDb.set(id, updated);
    return updated;
  }
}

export class PostgresNotificationRepository implements INotificationRepository {
  public async findById(id: string): Promise<NotificationEntity | null> {
    const n = notificationsDb.get(id);
    if (!n || n.deletedAt) return null;
    return n;
  }

  public async create(data: Omit<NotificationEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<NotificationEntity> {
    const entity: NotificationEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };
    notificationsDb.set(entity.id, entity);
    return entity;
  }

  public async updateStatus(id: string, status: string, providerRef?: string): Promise<boolean> {
    const n = notificationsDb.get(id);
    if (!n) return false;
    n.status = status as NotificationStatus;
    if (providerRef) n.providerReference = providerRef;
    n.updatedAt = new Date();
    return true;
  }
}

export class PostgresAuditRepository implements IAuditRepository {
  public async create(data: Omit<AuditLogEntity, 'id' | 'createdAt'>): Promise<AuditLogEntity> {
    const entry: AuditLogEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };
    auditLogsDb.push(entry);
    return entry;
  }

  public async findByActorId(actorId: string, limit = 50): Promise<AuditLogEntity[]> {
    return auditLogsDb.filter((a) => a.actorId === actorId).slice(-limit);
  }
}

export class PostgresWebhookRepository implements IWebhookRepository {
  public async findById(id: string): Promise<WebhookSubscriptionEntity | null> {
    const s = webhooksDb.get(id);
    if (!s || s.deletedAt) return null;
    return s;
  }

  public async findByMerchantId(merchantId: string): Promise<WebhookSubscriptionEntity[]> {
    return Array.from(webhooksDb.values()).filter((w) => w.merchantId === merchantId && !w.deletedAt);
  }

  public async create(data: Omit<WebhookSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>): Promise<WebhookSubscriptionEntity> {
    const entity: WebhookSubscriptionEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };
    webhooksDb.set(entity.id, entity);
    return entity;
  }

  public async incrementFailure(id: string): Promise<void> {
    const sub = webhooksDb.get(id);
    if (sub) {
      sub.failureCount++;
      if (sub.failureCount >= 5) {
        sub.isActive = false; // Auto-disable after 5 consecutive failures
      }
    }
  }
}
