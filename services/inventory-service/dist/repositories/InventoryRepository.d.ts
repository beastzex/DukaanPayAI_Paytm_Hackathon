import { SKU, Inventory } from '@dukaanpay/shared-types';
export interface CreateSKUParams {
    merchantId: string;
    skuCode: string;
    productName: string;
    category: string;
    brand?: string;
    unitOfMeasure: string;
    standardMrp: number;
    avgPurchasePrice: number;
    sellingPrice: number;
}
export interface InventoryItemDetail {
    inventoryId: string;
    skuId: string;
    skuCode: string;
    productName: string;
    category: string;
    currentStockUnits: number;
    reorderPointUnits: number;
    safetyStockUnits: number;
    standardMrp: number;
    sellingPrice: number;
    isLowStock: boolean;
    predictedStockoutAt?: Date;
}
export declare class InventoryRepository {
    createSKU(params: CreateSKUParams): Promise<SKU>;
    initializeInventory(storeId: string, skuId: string, initialStock: number, reorderPoint: number, safetyStock: number): Promise<Inventory>;
    updateStockUnits(storeId: string, skuId: string, deltaUnits: number): Promise<InventoryItemDetail | null>;
    getInventoryItem(storeId: string, skuId: string): Promise<InventoryItemDetail | null>;
    getStoreInventory(storeId: string): Promise<InventoryItemDetail[]>;
    getLowStockItems(storeId: string): Promise<InventoryItemDetail[]>;
}
//# sourceMappingURL=InventoryRepository.d.ts.map