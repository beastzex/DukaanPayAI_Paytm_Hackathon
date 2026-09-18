export interface BaseEntity {
  id: string; // UUID
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number; // Optimistic Locking
}

export enum UserRole {
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  CREDIT_OFFICER = 'CREDIT_OFFICER',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  VOICE = 'VOICE',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface MerchantEntity extends BaseEntity {
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  email?: string;
  category: string;
  pincode: string;
  city: string;
  state: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  preferredLanguage: string;
  settings: Record<string, any>;
}

export interface UserEntity extends BaseEntity {
  merchantId?: string;
  phoneNumber: string;
  email?: string;
  passwordHash: string; // Argon2
  roles: UserRole[];
  permissions: string[];
  refreshTokenHash?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface CampaignEntity extends BaseEntity {
  merchantId: string;
  title: string;
  targetSegment: string;
  channel: NotificationChannel;
  templateSlug: string;
  templateParameters: Record<string, any>;
  scheduledAt?: Date;
  status: CampaignStatus;
  audienceCount: number;
  deliveredCount: number;
  failedCount: number;
}

export interface NotificationEntity extends BaseEntity {
  merchantId: string;
  campaignId?: string;
  channel: NotificationChannel;
  recipient: string;
  content: string;
  status: NotificationStatus;
  providerReference?: string; // Twilio SID or WhatsApp Message ID
  retryCount: number;
  errorMessage?: string;
}

export interface AuditLogEntity {
  id: string; // UUID
  actorId: string;
  actorType: 'USER' | 'SYSTEM' | 'EXTERNAL_AI' | 'TWILIO_WEBHOOK';
  action: string;
  entityName: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface WebhookSubscriptionEntity extends BaseEntity {
  merchantId: string;
  targetUrl: string;
  secret: string; // HMAC signing key
  subscribedEvents: string[];
  isActive: boolean;
  failureCount: number;
}
