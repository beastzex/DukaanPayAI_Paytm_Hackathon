import { InventoryItemDetail } from '../repositories/InventoryRepository';
import { CreateSKUInput, UpdateStockInput } from '@dukaanpay/shared-validators';
import { SKU } from '@dukaanpay/shared-types';
export declare class InventoryService {
    private repo;
    private eventBus;
    constructor();
    registerSKU(merchantId: string, storeId: string, input: CreateSKUInput): Promise<{
        sku: SKU;
        inventory: InventoryItemDetail;
    }>;
    updateStock(input: UpdateStockInput, correlationId?: string): Promise<InventoryItemDetail>;
    getInventoryStatus(storeId: string): Promise<InventoryItemDetail[]>;
    getLowStockAlerts(storeId: string): Promise<InventoryItemDetail[]>;
}
//# sourceMappingURL=InventoryService.d.ts.map