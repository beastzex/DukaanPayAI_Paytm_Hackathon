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

  getFootfallForecast() {
    return {
      morningRush: { timeWindow: '08:00 - 10:30 AM', expectedFootfall: 48, gmvINR: 3400, topItems: 'Amul Milk, Bread, Eggs' },
      afternoonLull: { timeWindow: '12:00 - 16:00 PM', expectedFootfall: 18, gmvINR: 1950, note: 'Slow footfall period, ideal for distributor reordering & shelf restocking' },
      eveningRush: { timeWindow: '18:00 - 20:30 PM', expectedFootfall: 72, gmvINR: 7850, peakHour: '19:00', billPaceSec: 90, note: 'High rush! Cold drinks, snacks & daily staples' },
      nightClosing: { timeWindow: '21:00 - 22:30 PM', expectedFootfall: 20, gmvINR: 2650, note: 'Daily khata settlement & closing purchases' },
      totalDayFootfall: 158,
      totalDayProjectedGmvINR: 18450,
    };
  },

  simulateWhatIfOrder(skuOrName: string, quantity: number) {
    const catalog: Record<string, { name: string; wholesaleCost: number; retailPrice: number; dailyVelocity: number; category: string; maxShelfLifeDays: number }> = {
      maggi: { name: 'Maggi 2-Min Noodles 70g', wholesaleCost: 11.5, retailPrice: 14, dailyVelocity: 14, category: 'Packaged Foods', maxShelfLifeDays: 180 },
      milk: { name: 'Amul Taaza Milk 500ml', wholesaleCost: 24.5, retailPrice: 27, dailyVelocity: 42, category: 'Dairy', maxShelfLifeDays: 2 },
      oil: { name: 'Fortune Mustard Oil 1L', wholesaleCost: 132, retailPrice: 152, dailyVelocity: 6, category: 'Cooking Oil', maxShelfLifeDays: 240 },
      thumsup: { name: 'Thums Up 750ml', wholesaleCost: 34, retailPrice: 40, dailyVelocity: 18, category: 'Cold Drinks', maxShelfLifeDays: 90 },
      biscuit: { name: 'Good Day Butter Cookies', wholesaleCost: 16.5, retailPrice: 20, dailyVelocity: 12, category: 'Snacks', maxShelfLifeDays: 120 },
      atta: { name: 'Aashirvaad Shudh Chakki Atta 5kg', wholesaleCost: 215, retailPrice: 245, dailyVelocity: 4, category: 'Staples', maxShelfLifeDays: 90 },
    };

    const key = Object.keys(catalog).find((k) => skuOrName.toLowerCase().includes(k)) || 'maggi';
    const item = catalog[key];

    const daysToSellOut = Number((quantity / item.dailyVelocity).toFixed(1));
    const capitalRequired = quantity * item.wholesaleCost;
    const projectedRevenue = quantity * item.retailPrice;
    const grossProfit = projectedRevenue - capitalRequired;
    const marginPercent = Number(((grossProfit / projectedRevenue) * 100).toFixed(1));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let recommendation = '';

    if (daysToSellOut > item.maxShelfLifeDays) {
      riskLevel = 'HIGH';
      recommendation = `High spoilage risk! Shelf life is ${item.maxShelfLifeDays} days, but order will take ${daysToSellOut} days to sell. Reduce order quantity to ${Math.floor(item.dailyVelocity * 15)} units.`;
    } else if (daysToSellOut > 14 && item.category !== 'Cooking Oil') {
      riskLevel = 'MEDIUM';
      recommendation = `Capital lockup risk! ₹${capitalRequired.toLocaleString('en-IN')} will be locked for ${daysToSellOut} days. Recommended optimal batch: ${item.dailyVelocity * 7} units (7-day buffer).`;
    } else {
      riskLevel = 'LOW';
      recommendation = `Excellent high-velocity reorder! Stock will sell out in ${daysToSellOut} days with ₹${grossProfit.toLocaleString('en-IN')} projected gross margin (${marginPercent}%).`;
    }

    return {
      item: item.name,
      quantity,
      dailyVelocity: item.dailyVelocity,
      daysToSellOut,
      capitalRequired,
      projectedRevenue,
      grossProfit,
      marginPercent,
      riskLevel,
      recommendation,
    };
  },

  getVirtualCaTaxAndWealth() {
    const annualTurnover = 6924536; // ₹69.2L from synthetic dataset
    const digitalTurnoverPct = 78; // 78% via Paytm Soundbox / QR
    const cashTurnoverPct = 22;

    // Presumptive Tax under Section 44AD: 6% on digital, 8% on cash
    const presumptiveDigitalProfit = (annualTurnover * (digitalTurnoverPct / 100)) * 0.06;
    const presumptiveCashProfit = (annualTurnover * (cashTurnoverPct / 100)) * 0.08;
    const totalPresumptiveProfit = presumptiveDigitalProfit + presumptiveCashProfit;

    // Tax without 44AD digital benefit (flat 8% on all)
    const flatProfit = annualTurnover * 0.08;
    const annualDirectTaxSavedINR = Math.round((flatProfit - totalPresumptiveProfit) * 0.3); // 30% tax bracket saving

    // GST Composition Scheme (1% flat for Kirana under ₹1.5 Cr)
    const gstCompositionLiability = Math.round(annualTurnover * 0.01);
    const regularGstComplianceCostSaved = 36000; // CA filing charges saved per year

    // Daily Cash Sweep into Liquid Fund / Sweep FD (6.8% p.a.)
    const averageIdleDailyBalance = 35000;
    const dailySweepAnnualInterestINR = Math.round(averageIdleDailyBalance * 0.068);

    return {
      annualTurnoverINR: annualTurnover,
      section44ad: {
        digitalUpiRate: '6% (Save 2% vs Cash)',
        cashRate: '8%',
        digitalTurnoverINR: Math.round(annualTurnover * 0.78),
        taxableProfitDeclared: Math.round(totalPresumptiveProfit),
        annualTaxSavedINR: annualDirectTaxSavedINR,
        recommendation: 'Encourage 100% Paytm QR UPI payments to minimize presumptive taxable profit from 8% to 6%.',
      },
      gstComposition: {
        eligibility: 'Eligible (Turnover < ₹1.5 Crore)',
        taxRate: '1% Flat (0.5% CGST + 0.5% SGST)',
        annualLiabilityINR: gstCompositionLiability,
        caAuditFeeSavedINR: regularGstComplianceCostSaved,
        benefit: 'No mandatory monthly HSN-wise purchase matching. Quarterly flat return CMP-08.',
      },
      wealthAdvisory: {
        recommendedTool: 'Paytm Payments Bank / Daily Auto-Sweep Liquid Fund (6.8% p.a.)',
        idleFloatBalanceINR: averageIdleDailyBalance,
        annualPassiveIncomeINR: dailySweepAnnualInterestINR,
        liquidityWindow: 'T+0 Instant working capital withdrawal',
      },
      totalAnnualMerchantGainINR: annualDirectTaxSavedINR + regularGstComplianceCostSaved + dailySweepAnnualInterestINR,
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
