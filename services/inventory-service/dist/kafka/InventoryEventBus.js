"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryEventBus = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const InventoryRepository_1 = require("../repositories/InventoryRepository");
const logger = (0, common_utils_1.createServiceLogger)('inventory-kafka-bus');
class InventoryEventBus {
    eventBus;
    repo;
    constructor() {
        this.eventBus = new common_utils_1.KafkaEventBus('inventory-service');
        this.repo = new InventoryRepository_1.InventoryRepository();
    }
    async publishInventoryAlert(payload, correlationId = 'stock-alert') {
        try {
            await this.eventBus.publishEvent('inventory.alert', payload.storeId, payload, correlationId);
            logger.warn(`Published inventory.alert for SKU: ${payload.productName}`, {
                skuCode: payload.skuCode,
                currentStock: payload.currentStock,
            });
        }
        catch (err) {
            logger.error('Failed to publish inventory.alert', { error: err.message });
        }
    }
    async startConsumers() {
        try {
            await this.eventBus.startConsumer('inventory-service-group', ['invoice.processed'], async (event) => {
                if (event.eventType === 'invoice.processed') {
                    logger.info(`Processing invoice.processed event to auto-restock: ${event.payload.invoiceId}`);
                    // In production, fetch line items and call repo.updateStockUnits()
                }
            });
        }
        catch (err) {
            logger.error('Kafka consumer error in InventoryService', { error: err.message });
        }
    }
}
exports.InventoryEventBus = InventoryEventBus;
//# sourceMappingURL=InventoryEventBus.js.map