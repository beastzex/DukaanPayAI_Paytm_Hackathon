import { InventoryRepository, InventoryItemDetail } from '../repositories/InventoryRepository';
import { InventoryEventBus } from '../kafka/InventoryEventBus';
import { CreateSKUInput, UpdateStockInput } from '@dukaanpay/shared-validators';
import { SKU } from '@dukaanpay/shared-types';
import { NotFoundError } from '@dukaanpay/common-utils';

export class InventoryService {
  private repo: InventoryRepository;
  private eventBus: InventoryEventBus;

  constructor() {
    this.repo = new InventoryRepository();
    this.eventBus = new InventoryEventBus();
  }

  public async registerSKU(
    merchantId: string,
    storeId: string,
    input: CreateSKUInput
  ): Promise<{ sku: SKU; inventory: InventoryItemDetail }> {
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

    await this.repo.initializeInventory(
      storeId,
      sku.id,
      input.initialStock,
      input.reorderPoint,
      input.safetyStock
    );

    const detail = await this.repo.getInventoryItem(storeId, sku.id);
    if (!detail) {
      throw new NotFoundError('Inventory SKU mapping');
    }

    return { sku, inventory: detail };
  }

  public async updateStock(
    input: UpdateStockInput,
    correlationId = 'stock-update'
  ): Promise<InventoryItemDetail> {
    const updated = await this.repo.updateStockUnits(
      input.storeId,
      input.skuId,
      input.unitsToAdd
    );

    if (!updated) {
      throw new NotFoundError('Inventory item');
    }

    // Check if item has breached reorder threshold
    if (updated.isLowStock) {
      await this.eventBus.publishInventoryAlert(
        {
          storeId: input.storeId,
          skuId: updated.skuId,
          skuCode: updated.skuCode,
          productName: updated.productName,
          currentStock: updated.currentStockUnits,
          reorderPoint: updated.reorderPointUnits,
          predictedDaysUntilStockout: Math.max(1, Math.round(updated.currentStockUnits / 3)), // heuristic
        },
        correlationId
      );
    }

    return updated;
  }

  public async getInventoryStatus(storeId: string): Promise<InventoryItemDetail[]> {
    return this.repo.getStoreInventory(storeId);
  }

  public async getLowStockAlerts(storeId: string): Promise<InventoryItemDetail[]> {
    return this.repo.getLowStockItems(storeId);
  }
}
