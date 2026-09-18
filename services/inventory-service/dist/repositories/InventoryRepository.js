"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRepository = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
class InventoryRepository {
    async createSKU(params) {
        const query = `
      INSERT INTO skus (
        merchant_id, sku_code, product_name, category, brand, 
        unit_of_measure, standard_mrp, avg_purchase_price, selling_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (merchant_id, sku_code) DO UPDATE 
        SET product_name = EXCLUDED.product_name,
            selling_price = EXCLUDED.selling_price,
            updated_at = CURRENT_TIMESTAMP
      RETURNING id, merchant_id as "merchantId", sku_code as "skuCode", 
                product_name as "productName", category, brand, 
                unit_of_measure as "unitOfMeasure", standard_mrp as "standardMrp", 
                avg_purchase_price as "avgPurchasePrice", selling_price as "sellingPrice", 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
        const values = [
            params.merchantId,
            params.skuCode,
            params.productName,
            params.category,
            params.brand || null,
            params.unitOfMeasure,
            params.standardMrp,
            params.avgPurchasePrice,
            params.sellingPrice,
        ];
        const result = await common_utils_1.DatabaseService.query(query, values);
        return result.rows[0];
    }
    async initializeInventory(storeId, skuId, initialStock, reorderPoint, safetyStock) {
        const query = `
      INSERT INTO inventory (
        store_id, sku_id, current_stock_units, reorder_point_units, 
        safety_stock_units, is_low_stock
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (store_id, sku_id) DO UPDATE
        SET current_stock_units = EXCLUDED.current_stock_units,
            updated_at = CURRENT_TIMESTAMP
      RETURNING id, store_id as "storeId", sku_id as "skuId", 
                current_stock_units as "currentStockUnits", 
                reorder_point_units as "reorderPointUnits", 
                safety_stock_units as "safetyStockUnits", 
                is_low_stock as "isLowStock", updated_at as "updatedAt"
    `;
        const isLow = initialStock <= reorderPoint;
        const result = await common_utils_1.DatabaseService.query(query, [
            storeId,
            skuId,
            initialStock,
            reorderPoint,
            safetyStock,
            isLow,
        ]);
        return result.rows[0];
    }
    async updateStockUnits(storeId, skuId, deltaUnits) {
        const query = `
      UPDATE inventory
      SET current_stock_units = GREATEST(0, current_stock_units + $3),
          is_low_stock = (current_stock_units + $3) <= reorder_point_units,
          last_restocked_at = CASE WHEN $3 > 0 THEN CURRENT_TIMESTAMP ELSE last_restocked_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE store_id = $1 AND sku_id = $2
      RETURNING id
    `;
        await common_utils_1.DatabaseService.query(query, [storeId, skuId, deltaUnits]);
        return this.getInventoryItem(storeId, skuId);
    }
    async getInventoryItem(storeId, skuId) {
        const query = `
      SELECT 
        i.id as "inventoryId", i.sku_id as "skuId", s.sku_code as "skuCode",
        s.product_name as "productName", s.category,
        i.current_stock_units::float as "currentStockUnits",
        i.reorder_point_units::float as "reorderPointUnits",
        i.safety_stock_units::float as "safetyStockUnits",
        s.standard_mrp::float as "standardMrp",
        s.selling_price::float as "sellingPrice",
        i.is_low_stock as "isLowStock",
        i.predicted_stockout_at as "predictedStockoutAt"
      FROM inventory i
      JOIN skus s ON i.sku_id = s.id
      WHERE i.store_id = $1 AND i.sku_id = $2
    `;
        const result = await common_utils_1.DatabaseService.query(query, [storeId, skuId]);
        return result.rows[0] || null;
    }
    async getStoreInventory(storeId) {
        const query = `
      SELECT 
        i.id as "inventoryId", i.sku_id as "skuId", s.sku_code as "skuCode",
        s.product_name as "productName", s.category,
        i.current_stock_units::float as "currentStockUnits",
        i.reorder_point_units::float as "reorderPointUnits",
        i.safety_stock_units::float as "safetyStockUnits",
        s.standard_mrp::float as "standardMrp",
        s.selling_price::float as "sellingPrice",
        i.is_low_stock as "isLowStock",
        i.predicted_stockout_at as "predictedStockoutAt"
      FROM inventory i
      JOIN skus s ON i.sku_id = s.id
      WHERE i.store_id = $1
      ORDER BY i.is_low_stock DESC, s.product_name ASC
    `;
        const result = await common_utils_1.DatabaseService.query(query, [storeId]);
        return result.rows;
    }
    async getLowStockItems(storeId) {
        const query = `
      SELECT 
        i.id as "inventoryId", i.sku_id as "skuId", s.sku_code as "skuCode",
        s.product_name as "productName", s.category,
        i.current_stock_units::float as "currentStockUnits",
        i.reorder_point_units::float as "reorderPointUnits",
        i.safety_stock_units::float as "safetyStockUnits",
        s.standard_mrp::float as "standardMrp",
        s.selling_price::float as "sellingPrice",
        i.is_low_stock as "isLowStock",
        i.predicted_stockout_at as "predictedStockoutAt"
      FROM inventory i
      JOIN skus s ON i.sku_id = s.id
      WHERE i.store_id = $1 AND i.is_low_stock = TRUE
      ORDER BY i.current_stock_units ASC
    `;
        const result = await common_utils_1.DatabaseService.query(query, [storeId]);
        return result.rows;
    }
}
exports.InventoryRepository = InventoryRepository;
//# sourceMappingURL=InventoryRepository.js.map