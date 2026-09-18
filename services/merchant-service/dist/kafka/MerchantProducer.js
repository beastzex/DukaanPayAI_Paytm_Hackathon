"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantProducer = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const logger = (0, common_utils_1.createServiceLogger)('merchant-kafka-producer');
class MerchantProducer {
    eventBus;
    constructor() {
        this.eventBus = new common_utils_1.KafkaEventBus('merchant-service');
    }
    async publishMerchantCreated(merchant, correlationId = 'merchant-init') {
        const payload = {
            merchantId: merchant.id,
            phoneNumber: merchant.phoneNumber,
            businessName: merchant.businessName,
            subscriptionTier: merchant.subscriptionTier,
            preferredLanguage: merchant.preferredLanguage,
        };
        try {
            await this.eventBus.publishEvent('merchant.created', merchant.id, payload, correlationId);
            logger.info('Published merchant.created event', { merchantId: merchant.id });
        }
        catch (err) {
            logger.error('Failed to publish merchant.created event', { error: err.message });
        }
    }
    async publishMerchantUpdated(merchant, correlationId = 'merchant-update') {
        try {
            await this.eventBus.publishEvent('merchant.updated', merchant.id, merchant, correlationId);
            logger.info('Published merchant.updated event', { merchantId: merchant.id });
        }
        catch (err) {
            logger.error('Failed to publish merchant.updated event', { error: err.message });
        }
    }
}
exports.MerchantProducer = MerchantProducer;
//# sourceMappingURL=MerchantProducer.js.map