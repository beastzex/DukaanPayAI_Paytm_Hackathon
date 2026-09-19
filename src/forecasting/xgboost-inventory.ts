/**
 * Layer 2 — Forecasting Layer: XGBoost & LightGBM Inventory & Footfall Models
 * Computes safety stock, reorder quantities, and rush-hour footfall density.
 */

export interface InventoryRestockPrediction {
  sku: string;
  name: string;
  currentStock: number;
  dailyDepletionRate: number;
  daysUntilStockout: number;
  recommendedReorderQty: number;
  stockoutProbabilityPercent: number;
  leadTimeDays: number;
  riskCategory: 'CRITICAL' | 'WARNING' | 'HEALTHY';
}

export const XGBOOST_INVENTORY_PREDICTIONS: InventoryRestockPrediction[] = [
  {
    sku: 'AML-BTR-500',
    name: 'Amul Salted Butter (500g)',
    currentStock: 4,
    dailyDepletionRate: 8.5,
    daysUntilStockout: 0.47,
    recommendedReorderQty: 48,
    stockoutProbabilityPercent: 96.2,
    leadTimeDays: 1,
    riskCategory: 'CRITICAL',
  },
  {
    sku: 'MAG-NOD-70G',
    name: 'Maggi 2-Minute Masala Noodles (70g)',
    currentStock: 12,
    dailyDepletionRate: 18.0,
    daysUntilStockout: 0.67,
    recommendedReorderQty: 96,
    stockoutProbabilityPercent: 88.5,
    leadTimeDays: 1,
    riskCategory: 'CRITICAL',
  },
  {
    sku: 'PRL-PLG-1KG',
    name: 'Parle-G Gold Biscuits (1kg pack)',
    currentStock: 16,
    dailyDepletionRate: 9.2,
    daysUntilStockout: 1.74,
    recommendedReorderQty: 36,
    stockoutProbabilityPercent: 54.0,
    leadTimeDays: 2,
    riskCategory: 'WARNING',
  },
  {
    sku: 'THU-SDA-750',
    name: 'Thums Up Charged (750ml PET)',
    currentStock: 8,
    dailyDepletionRate: 14.5,
    daysUntilStockout: 0.55,
    recommendedReorderQty: 48,
    stockoutProbabilityPercent: 91.0,
    leadTimeDays: 1,
    riskCategory: 'CRITICAL',
  },
  {
    sku: 'ASH-ATT-5KG',
    name: 'Aashirvaad Shudh Chakki Atta (5kg)',
    currentStock: 22,
    dailyDepletionRate: 4.1,
    daysUntilStockout: 5.36,
    recommendedReorderQty: 20,
    stockoutProbabilityPercent: 12.0,
    riskCategory: 'HEALTHY',
    leadTimeDays: 2,
  },
];
