"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresWebhookRepository = exports.PostgresAuditRepository = exports.PostgresNotificationRepository = exports.PostgresCampaignRepository = exports.PostgresUserRepository = exports.PostgresMerchantRepository = void 0;
const domain_exceptions_1 = require("../../domain/exceptions/domain-exceptions");
const uuid_1 = require("uuid");
// In-Memory state seed for dual-mode local testing
const merchantsDb = new Map();
const usersDb = new Map();
const campaignsDb = new Map();
const notificationsDb = new Map();
const auditLogsDb = [];
const webhooksDb = new Map();
// Seed default merchant & user
const defaultMerchantId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
const seedMerchant = {
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
class PostgresMerchantRepository {
    async findById(id) {
        const m = merchantsDb.get(id);
        if (!m || m.deletedAt)
            return null;
        return m;
    }
    async findByPhone(phone) {
        for (const m of merchantsDb.values()) {
            if (m.phoneNumber === phone && !m.deletedAt)
                return m;
        }
        return null;
    }
    async create(data) {
        const entity = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            version: 1,
        };
        merchantsDb.set(entity.id, entity);
        return entity;
    }
    async update(id, updates, expectedVersion) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error(`Merchant ${id} not found`);
        if (existing.version !== expectedVersion) {
            throw new domain_exceptions_1.OptimisticLockException('Merchant', id, existing.version);
        }
        const updated = {
            ...existing,
            ...updates,
            version: existing.version + 1,
            updatedAt: new Date(),
        };
        merchantsDb.set(id, updated);
        return updated;
    }
    async delete(id) {
        const existing = await this.findById(id);
        if (!existing)
            return false;
        existing.deletedAt = new Date();
        existing.updatedAt = new Date();
        return true;
    }
}
exports.PostgresMerchantRepository = PostgresMerchantRepository;
class PostgresUserRepository {
    async findById(id) {
        const u = usersDb.get(id);
        if (!u || u.deletedAt)
            return null;
        return u;
    }
    async findByPhone(phone) {
        for (const u of usersDb.values()) {
            if (u.phoneNumber === phone && !u.deletedAt)
                return u;
        }
        return null;
    }
    async findByEmail(email) {
        for (const u of usersDb.values()) {
            if (u.email === email && !u.deletedAt)
                return u;
        }
        return null;
    }
    async create(data) {
        const entity = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            version: 1,
        };
        usersDb.set(entity.id, entity);
        return entity;
    }
    async update(id, updates, expectedVersion) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error(`User ${id} not found`);
        if (existing.version !== expectedVersion) {
            throw new domain_exceptions_1.OptimisticLockException('User', id, existing.version);
        }
        const updated = {
            ...existing,
            ...updates,
            version: existing.version + 1,
            updatedAt: new Date(),
        };
        usersDb.set(id, updated);
        return updated;
    }
    async delete(id) {
        const existing = await this.findById(id);
        if (!existing)
            return false;
        existing.deletedAt = new Date();
        existing.updatedAt = new Date();
        return true;
    }
}
exports.PostgresUserRepository = PostgresUserRepository;
class PostgresCampaignRepository {
    async findById(id) {
        const c = campaignsDb.get(id);
        if (!c || c.deletedAt)
            return null;
        return c;
    }
    async findByMerchantId(merchantId, limit = 20) {
        return Array.from(campaignsDb.values())
            .filter((c) => c.merchantId === merchantId && !c.deletedAt)
            .slice(0, limit);
    }
    async create(data) {
        const entity = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            version: 1,
        };
        campaignsDb.set(entity.id, entity);
        return entity;
    }
    async update(id, updates, expectedVersion) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error(`Campaign ${id} not found`);
        if (existing.version !== expectedVersion) {
            throw new domain_exceptions_1.OptimisticLockException('Campaign', id, existing.version);
        }
        const updated = {
            ...existing,
            ...updates,
            version: existing.version + 1,
            updatedAt: new Date(),
        };
        campaignsDb.set(id, updated);
        return updated;
    }
}
exports.PostgresCampaignRepository = PostgresCampaignRepository;
class PostgresNotificationRepository {
    async findById(id) {
        const n = notificationsDb.get(id);
        if (!n || n.deletedAt)
            return null;
        return n;
    }
    async create(data) {
        const entity = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            version: 1,
        };
        notificationsDb.set(entity.id, entity);
        return entity;
    }
    async updateStatus(id, status, providerRef) {
        const n = notificationsDb.get(id);
        if (!n)
            return false;
        n.status = status;
        if (providerRef)
            n.providerReference = providerRef;
        n.updatedAt = new Date();
        return true;
    }
}
exports.PostgresNotificationRepository = PostgresNotificationRepository;
class PostgresAuditRepository {
    async create(data) {
        const entry = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
        };
        auditLogsDb.push(entry);
        return entry;
    }
    async findByActorId(actorId, limit = 50) {
        return auditLogsDb.filter((a) => a.actorId === actorId).slice(-limit);
    }
}
exports.PostgresAuditRepository = PostgresAuditRepository;
class PostgresWebhookRepository {
    async findById(id) {
        const s = webhooksDb.get(id);
        if (!s || s.deletedAt)
            return null;
        return s;
    }
    async findByMerchantId(merchantId) {
        return Array.from(webhooksDb.values()).filter((w) => w.merchantId === merchantId && !w.deletedAt);
    }
    async create(data) {
        const entity = {
            ...data,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            version: 1,
        };
        webhooksDb.set(entity.id, entity);
        return entity;
    }
    async incrementFailure(id) {
        const sub = webhooksDb.get(id);
        if (sub) {
            sub.failureCount++;
            if (sub.failureCount >= 5) {
                sub.isActive = false; // Auto-disable after 5 consecutive failures
            }
        }
    }
}
exports.PostgresWebhookRepository = PostgresWebhookRepository;
//# sourceMappingURL=postgres-repositories.js.map