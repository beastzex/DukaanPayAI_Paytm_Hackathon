import prophetData from '../../ml/models/prophet_forecast_curve.json';
import xgboostData from '../../ml/models/xgboost_predictions.json';
import rfmData from '../../ml/models/rfm_segments.json';
import evalReport from '../../ml/models/ml_evaluation_report.json';

export interface ProphetPoint {
  timestamp: string;
  hour: string;
  predicted_revenue: number;
  lower_bound: number;
  upper_bound: number;
  trend: number;
  rain_impact: number;
}

export interface StockoutPrediction {
  sku: string;
  sku_name: string;
  category: string;
  unit_price: number;
  current_shelf_stock: number;
  stockout_risk_score: number;
  predicted_stockout_within_24h: boolean;
  lead_time_h: number;
}

export interface RfmCluster {
  cluster_id: number;
  label: string;
  count: number;
  pct_of_customers: number;
  avg_recency_days: number;
  avg_frequency_orders: number;
  avg_monetary_spend: number;
  retention_strategy: string;
  action_urgency: string;
}

export const MLClient = {
  getEvaluationReport() {
    return evalReport;
  },

  getProphetForecast(): { metrics: typeof prophetData.metrics; curve: ProphetPoint[] } {
    return prophetData as any;
  },

  getXGBoostPredictions(): {
    metrics: typeof xgboostData.metrics;
    feature_importances: typeof xgboostData.feature_importances;
    top_stockout_risks: StockoutPrediction[];
    sku_predictions: any[];
  } {
    const rawList = (xgboostData as any).sku_predictions || [];
    const mapped: StockoutPrediction[] = rawList.map((item: any) => ({
      sku: item.sku,
      sku_name: item.name,
      category: item.category,
      unit_price: 120,
      current_shelf_stock: item.current_stock,
      stockout_risk_score: item.stockout_probability_pct,
      predicted_stockout_within_24h: item.risk_category !== 'HEALTHY',
      lead_time_h: item.supplier_lead_time_h,
    }));
    return {
      metrics: xgboostData.metrics,
      feature_importances: xgboostData.feature_importances,
      top_stockout_risks: mapped,
      sku_predictions: rawList,
    };
  },

  getRfmSegments(): {
    metrics: typeof rfmData.metrics;
    clusters: RfmCluster[];
  } {
    return rfmData as any;
  },

  getDiurnalPeakRush(): { morningRush: string; eveningRush: string; peakHour: string; peakGmv: number } {
    const curve = prophetData.curve;
    const peak = [...curve].sort((a, b) => b.predicted_revenue - a.predicted_revenue)[0];
    return {
      morningRush: '08:00 - 10:30 AM (Milk & Breakfast items)',
      eveningRush: '18:00 - 21:00 PM (Snacks & Daily staples)',
      peakHour: peak ? peak.hour : '19:00',
      peakGmv: peak ? peak.predicted_revenue : 2840,
    };
  },

  getStoreSummary() {
    return {
      storeName: 'Laxmi Kirana & General Store',
      merchantName: 'रामेश्वर गुप्ता (Rameshwar Gupta)',
      merchantId: 'PTM_KIRANA_98210',
      pincode: '302001',
      city: 'Jaipur, Rajasthan',
      soundboxDeviceId: 'PTM-SBOX-4G-9921',
      soundboxStatus: 'Online (4G VoLTE)',
      totalTransactions: 55000,
      annualGmvINR: 6924536,
      todayProjectedSalesINR: 18450,
      currentDaySalesSoFarINR: 12840,
      todayTransactionsCount: 118,
      avgBasketSizeINR: 180,
      stockoutsAvertedThisWeekINR: 4200,
      dormantRecoveryThisMonthINR: 6800,
      wholesaleOverchargeRecoveredINR: 1450,
    };
  }
};
