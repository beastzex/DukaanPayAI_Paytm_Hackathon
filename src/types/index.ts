export type AgentId = 
  | 'bi' 
  | 'demand' 
  | 'inventory' 
  | 'footfall' 
  | 'retention' 
  | 'growth' 
  | 'campaign' 
  | 'execution';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  avatar: string;
  model: 'Groq GPT-OSS 120B' | 'Qwen Fast Multilingual' | 'Prophet ML' | 'XGBoost / LightGBM' | 'Vision AI (YOLO/Florence-2)';
  specialty: string;
  status: 'active' | 'analyzing' | 'idle' | 'executing';
  confidence: number;
  lastAction: string;
}

export interface MerchantHealthMetric {
  title: string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'neutral';
  change: string;
  description: string;
  rating: 'Exceptional' | 'Healthy' | 'Moderate' | 'Critical';
}

export interface MerchantHealthScoreData {
  overallScore: number; // e.g. 83
  tier: 'AAA Prime Merchant' | 'AA High Growth' | 'A Stable' | 'B At Risk';
  cibilEquivalent: 'Business Vitality Grade A+';
  summary: string;
  metrics: {
    revenueGrowth: MerchantHealthMetric;
    retentionRate: MerchantHealthMetric;
    inventoryRisk: MerchantHealthMetric;
    demandStability: MerchantHealthMetric;
    customerActivity: MerchantHealthMetric;
    forecastAccuracy: MerchantHealthMetric;
  };
}

export interface LostRevenueFactor {
  cause: string;
  lostAmount: number;
  impactPercent: number;
  explanation: string;
  remedyAction: string;
  agentResponsible: AgentId;
}

export interface LostRevenueData {
  expectedRevenue: number;
  actualRevenue: number;
  potentialLost: number;
  detectionPeriod: string;
  confidenceScore: number;
  factors: LostRevenueFactor[];
  recoveryStatus: 'Recoverable with 1-click action' | 'Partial Recovery' | 'Historical Insight';
}

export interface ExplainableFactor {
  title: string;
  value: string;
  weight: number; // percentage
  source: 'Paytm UPI Stream' | 'Weather API' | 'Festival Calendar' | 'Footfall Sensor' | 'Shelf Vision';
}

export interface Recommendation {
  id: string;
  agentId: AgentId;
  agentName: string;
  title: string;
  actionText: string;
  impactBadge: string;
  urgency: 'Immediate' | 'Today' | 'This Week';
  reason: string;
  confidenceScore: number; // 0-100
  supportingFactors: ExplainableFactor[];
  executed: boolean;
  actionPayload: {
    channel: 'WhatsApp' | 'Paytm Soundbox' | 'Distributor PO' | 'Paytm Merchant App';
    preview: string;
    recipient?: string;
    amount?: number;
  };
}

export interface InvoiceLineItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseCost: number;
  mrp: number;
  marginPercent: number;
  confidence: number;
  bbox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-100
}

export interface SupplierInvoice {
  id: string;
  distributorName: string;
  distributorPhone: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  gstin: string;
  paymentTerms: string;
  items: InvoiceLineItem[];
  imageUrl?: string;
  parsedAt: string;
  status: 'Parsed & Ingested' | 'Pending Verification';
}

export interface ShelfVisionDetection {
  id: string;
  productName: string;
  category: string;
  detectedCount: number;
  capacity: number;
  stockLevel: 'Adequate (>70%)' | 'Low (<30%)' | 'Empty (0%)';
  urgency: 'normal' | 'warning' | 'critical';
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  reorderSuggestion?: number;
}

export interface ShelfAngleScan {
  angleId: 'top_rack' | 'eye_level' | 'bottom_rack';
  title: string;
  subtitle: string;
  timestamp: string;
  utilizationRate: number; // percentage
  emptySlotsCount: number;
  detections: ShelfVisionDetection[];
}

export interface DailyTimelineStep {
  time: string;
  label: string;
  phase: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  icon: string;
  headline: string;
  soundboxVoiceHindi: string;
  soundboxVoiceEnglish: string;
  whatsappMessage: string;
  agentInteraction: string;
  actionsDone: string[];
  metrics: {
    revenue: string;
    projected: string;
    footfall: string;
  };
}

export interface ExecutedActionLog {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  actionTitle: string;
  channel: 'WhatsApp' | 'Soundbox' | 'Automated UPI' | 'Supplier PO';
  status: 'Completed' | 'In Flight' | 'Awaiting Confirmation';
  outcome: string;
}

export interface RoiSimulationParams {
  businessType: 'kirana' | 'pharmacy' | 'cafe' | 'fmcg_retail' | 'sweets_dairy';
  monthlyRevenue: number;
  avgBasketSize: number;
  supplierCount: number;
  repeatCustomerRate: number;
}

export interface RoiSimulationResults {
  extraMonthlyProfit: number;
  annualProfitIncrease: number;
  stockoutReductionRate: number;
  unlockedWorkingCapital: number;
  retentionLiftPercent: number;
  hoursSavedWeekly: number;
  paybackDays: number;
}
