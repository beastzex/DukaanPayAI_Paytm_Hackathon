"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantService = void 0;
const postgres_repositories_1 = require("../repositories/postgres/postgres-repositories");
const cache_aside_1 = require("../infrastructure/redis/cache-aside");
const kafka_client_1 = require("../events/kafka-client");
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const logger_1 = require("../monitoring/logger");
class MerchantService {
    merchantRepo = new postgres_repositories_1.PostgresMerchantRepository();
    async getProfile(id) {
        const cacheKey = `cache:merchant:${id}`;
        return cache_aside_1.CacheAside.getOrSet(cacheKey, async () => {
            const merchant = await this.merchantRepo.findById(id);
            if (!merchant) {
                throw new domain_exceptions_1.EntityNotFoundException('Merchant', id);
            }
            return merchant;
        }, 3600, // 1 hour TTL
        'merchants');
    }
    async register(data) {
        const existing = await this.merchantRepo.findByPhone(data.phoneNumber);
        if (existing) {
            throw new domain_exceptions_1.ConflictException(`Merchant with phone ${data.phoneNumber} already registered`);
        }
        const created = await this.merchantRepo.create(data);
        // Invalidate profile cache and publish domain event
        await cache_aside_1.CacheAside.invalidate(`cache:merchant:${created.id}`);
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.MERCHANT_CREATED, created.id, {
            merchantId: created.id,
            businessName: created.businessName,
            phoneNumber: created.phoneNumber,
            city: created.city,
        });
        logger_1.logger.info({ merchantId: created.id }, 'Merchant registered and domain event published');
        return created;
    }
    async updateSettings(id, settings, expectedVersion) {
        const updated = await this.merchantRepo.update(id, { settings }, expectedVersion);
        // Invalidate Redis cache
        await cache_aside_1.CacheAside.invalidate(`cache:merchant:${id}`);
        // Emit event
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.MERCHANT_UPDATED, id, { merchantId: id, fieldsUpdated: ['settings'] });
        logger_1.logger.info({ merchantId: id, version: updated.version }, 'Merchant settings updated with optimistic locking');
        return updated;
    }
}
exports.MerchantService = MerchantService;
//# sourceMappingURL=merchant.service.js.map