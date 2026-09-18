"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const InventoryRepository_1 = require("../repositories/InventoryRepository");
const InventoryEventBus_1 = require("../kafka/InventoryEventBus");
const common_utils_1 = require("@dukaanpay/common-utils");
class InventoryService {
    repo;
    eventBus;
    constructor() {
        this.repo = new InventoryRepository_1.InventoryRepository();
        this.eventBus = new InventoryEventBus_1.InventoryEventBus();
    }
    async registerSKU(merchantId, storeId, input) {
        const sku = await this.repo.createSKU({
            merchantId,
            skuCode: input.skuCode,
            productName: input.productName,
            category: input.category,
            brand: input.brand,
            unitOfMeasure: input.unitOfMeasure,
            standardMrp: input.standardMrp,
            avgPurchasePrice: input.avgPurchasePrice,
            sellingPrice: input.sellingPrice,
        });
        await this.repo.initializeInventory(storeId, sku.id, input.initialStock, input.reorderPoint, input.safetyStock);
        const detail = await this.repo.getInventoryItem(storeId, sku.id);
        if (!detail) {
            throw new common_utils_1.NotFoundError('Inventory SKU mapping');
        }
        return { sku, inventory: detail };
    }
    async updateStock(input, correlationId = 'stock-update') {
        const updated = await this.repo.updateStockUnits(input.storeId, input.skuId, input.unitsToAdd);
        if (!updated) {
            throw new common_utils_1.NotFoundError('Inventory item');
        }
        // Check if item has breached reorder threshold
        if (updated.isLowStock) {
            await this.eventBus.publishInventoryAlert({
                storeId: input.storeId,
                skuId: updated.skuId,
                skuCode: updated.skuCode,
                productName: updated.productName,
                currentStock: updated.currentStockUnits,
                reorderPoint: updated.reorderPointUnits,
                predictedDaysUntilStockout: Math.max(1, Math.round(updated.currentStockUnits / 3)), // heuristic
            }, correlationId);
        }
        return updated;
    }
    async getInventoryStatus(storeId) {
        return this.repo.getStoreInventory(storeId);
    }
    async getLowStockAlerts(storeId) {
        return this.repo.getLowStockItems(storeId);
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=InventoryService.js.map