/**
 * DukaanPayAI – Shared Types & Domain Definitions
 * Enterprise Type Definitions for all Node.js and TypeScript services
 */

// ==========================================
// 1. Core Domain Enums
// ==========================================

export enum UserRole {
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
  AI_AGENT = 'AI_AGENT',
  CREDIT_OFFICER = 'CREDIT_OFFICER',
}

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum SubscriptionTier {
  STARTER = 'STARTER',       // ₹299/mo: Daily voice briefing + basic anomaly alerts
  GROWTH_PRO = 'GROWTH_PRO', // ₹599/mo: Full demand forecast + WhatsApp campaign automation
  ENTERPRISE = 'ENTERPRISE', // ₹999/mo: Dedicated AI credit line + distributor price parity
}

export enum IndicLanguage {
  HINDI = 'hi',
  ENGLISH = 'en',
  TAMIL = 'ta',
  TELUGU = 'te',
  MARATHI = 'mr',
  BENGALI = 'bn',
  GUJARATI = 'gu',
  KANNADA = 'kn',
}

export enum PaymentMode {
  UPI = 'UPI',
  CARD = 'CARD',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
  CASH = 'CASH',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
}

export enum ForecastType {
  REVENUE_DAILY = 'REVENUE_DAILY',
  FOOTFALL_HOURLY = 'FOOTFALL_HOURLY',
  SKU_DEMAND = 'SKU_DEMAND',
}

export enum RecommendationType {
  RESTOCK_SKU = 'RESTOCK_SKU',
  DISTRIBUTOR_DISPUTE = 'DISTRIBUTOR_DISPUTE',
  CHURN_CAMPAIGN = 'CHURN_CAMPAIGN',
  PREPARE_PEAK_RUSH = 'PREPARE_PEAK_RUSH',
  WORKING_CAPITAL_LOAN = 'WORKING_CAPITAL_LOAN',
}

export enum RecommendationPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXECUTED = 'EXECUTED',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  VOICE_CALL = 'VOICE_CALL',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

export enum NotificationStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export enum HealthGrade {
  AAA = 'AAA', // 90-100: Prime credit eligible, instant 0-fee overdraft
  AA = 'AA',   // 75-89: Growth tier, low interest pre-approved credit
  A = 'A',     // 60-74: Stable, standard underwriting
  B = 'B',     // 45-59: Moderate risk, requires collateral or escrow hold
  C = 'C',     // <45: High risk, cashflow anomalies detected
}

// ==========================================
// 2. Core Entities
// ==========================================

export interface Merchant {
  id: string;
  merchantCode: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  businessName: string;
  kycStatus: KycStatus;
  subscriptionTier: SubscriptionTier;
  preferredLanguage: IndicLanguage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  merchantId: string;
  storeName: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  soundboxDeviceId?: string;
  upiVpa: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  merchantId: string;
  storeId: string;
  soundboxDeviceId?: string;
  txnReferenceId: string;
  payerVpaMasked?: string;
  amount: number;
  paymentMode: PaymentMode;
  status: TransactionStatus;
  capturedAt: Date;
  createdAt: Date;
}

export interface SKU {
  id: string;
  merchantId: string;
  skuCode: string;
  productName: string;
  category: string;
  brand?: string;
  unitOfMeasure: string;
  standardMrp: number;
  avgPurchasePrice: number;
  sellingPrice: number;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  storeId: string;
  skuId: string;
  currentStockUnits: number;
  reorderPointUnits: number;
  safetyStockUnits: number;
  lastRestockedAt?: Date;
  predictedStockoutAt?: Date;
  isLowStock: boolean;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  merchantId: string;
  phoneNumberMasked: string;
  fullName?: string;
  rfmSegment: string;
  churnProbability: number;
  loyaltyScore: number;
  totalSpend: number;
  totalVisits: number;
  lastVisitAt: Date;
  avgDaysBetweenVisits?: number;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  merchantId: string;
  storeId: string;
  distributorName: string;
  invoiceNumber?: string;
  invoiceDate: Date;
  totalAmount: number;
  ocrConfidenceScore: number;
  mongoDocumentId: string;
  overchargeDetected: number;
  status: string;
  createdAt: Date;
}

export interface Forecast {
  id: string;
  storeId: string;
  skuId?: string;
  forecastType: ForecastType;
  forecastStartDate: Date;
  forecastEndDate: Date;
  predictedValue: number;
  lowerBound?: number;
  upperBound?: number;
  confidenceInterval: number;
  modelVersion: string;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  merchantId: string;
  recommendationType: RecommendationType;
  title: string;
  bodyIndic: Record<string, string>;
  expectedRoiAmount?: number;
  priority: RecommendationPriority;
  status: 'ACTIVE' | 'DISMISSED' | 'APPLIED';
  expiresAt?: Date;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  merchantId: string;
  storeId: string;
  title: string;
  targetSegment: string;
  channel: NotificationChannel;
  templateSlug: string;
  parameters: Record<string, any>;
  approvalStatus: CampaignStatus;
  executionStatus: string;
  scheduledAt?: Date;
  executedAt?: Date;
  createdAt: Date;
}

export interface HealthScore {
  id: string;
  merchantId: string;
  compositeScore: number;
  revenueStabilityScore: number; // 35% weight
  inventoryHealthScore: number;  // 25% weight
  customerRetentionScore: number;// 20% weight
  supplierDisciplineScore: number;// 20% weight
  metricsSnapshot: {
    rolling30dRevenue: number;
    avgDailyTxnCount: number;
    stockoutFrequency: number;
    churnRatePercentage: number;
    avgDistributorPaymentDelayDays: number;
  };
  grade: HealthGrade;
  evaluatedAt: Date;
}

export interface CreditEligibility {
  id: string;
  merchantId: string;
  preApprovedAmount: number;
  interestRateMonthly: number;
  tenureDays: number;
  dailySoundboxEscrowDeduction: number;
  status: 'OFFERED' | 'ACCEPTED' | 'DISBURSED' | 'CLOSED' | 'EXPIRED';
  createdAt: Date;
}

// ==========================================
// 3. Kafka Event Payloads
// ==========================================

export interface BaseKafkaEvent<T> {
  eventId: string;
  eventType: string;
  timestamp: string;
  sourceService: string;
  correlationId: string;
  payload: T;
}

export interface MerchantCreatedPayload {
  merchantId: string;
  phoneNumber: string;
  businessName: string;
  subscriptionTier: SubscriptionTier;
  preferredLanguage: IndicLanguage;
}

export interface TransactionReceivedPayload {
  transactionId: string;
  merchantId: string;
  storeId: string;
  amount: number;
  soundboxDeviceId?: string;
  paymentMode: PaymentMode;
  capturedAt: string;
}

export interface InvoiceProcessedPayload {
  invoiceId: string;
  merchantId: string;
  storeId: string;
  distributorName: string;
  totalAmount: number;
  overchargeDetected: number;
  lineItemsCount: number;
  mongoDocumentId: string;
}

export interface ForecastGeneratedPayload {
  storeId: string;
  skuId?: string;
  forecastType: ForecastType;
  predictedValue: number;
  horizonDays: number;
  stockoutRiskDate?: string;
}

export interface InventoryAlertPayload {
  storeId: string;
  skuId: string;
  skuCode: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  predictedDaysUntilStockout: number;
}

export interface CampaignCreatedPayload {
  campaignId: string;
  merchantId: string;
  title: string;
  targetAudienceCount: number;
  projectedRevenue: number;
}

export interface CampaignExecutedPayload {
  campaignId: string;
  merchantId: string;
  dispatchedCount: number;
  timestamp: string;
}

export interface HealthScoreUpdatedPayload {
  merchantId: string;
  compositeScore: number;
  previousScore?: number;
  grade: HealthGrade;
  preApprovedLoanAmount?: number;
}

export interface NotificationSentPayload {
  notificationId: string;
  merchantId: string;
  channel: NotificationChannel;
  recipient: string;
  status: NotificationStatus;
}

// ==========================================
// 4. API Standard Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface AuthClaims {
  userId: string;
  merchantId?: string;
  phoneNumber: string;
  roles: UserRole[];
  preferredLanguage: IndicLanguage;
}

// ==========================================
// 5. Hackathon Innovations: Vision, Ledger & Intelligence
// ==========================================

export interface ShelfDetectedSKU {
  skuCode?: string;
  productName: string;
  estimatedCount: number;
  shelfLocation: string; // e.g. "Top Row - Left"
  stockStatus: 'AMPLE' | 'LOW' | 'EMPTY_SLOT';
  confidence: number;
}

export interface ShelfAnalysisResult {
  analysisId: string;
  merchantId: string;
  storeId: string;
  imageUrl: string;
  emptyShelfPercentage: number;
  totalSKUsDetected: number;
  detectedItems: ShelfDetectedSKU[];
  fastMovingGapsDetected: string[];
  suggestedRestockActionIndic: string;
  timestamp: string;
}

export interface RecordBookEntry {
  type: 'CASH_SALE' | 'UDHAAR_GIVEN' | 'UDHAAR_RECEIVED' | 'EXPENSE' | 'NOTE';
  description: string;
  amount: number;
  customerName?: string;
  customerPhone?: string;
}

export interface RecordBookExtractionResult {
  ledgerId: string;
  merchantId: string;
  date: string;
  imageUrl: string;
  totalCashSales: number;
  totalCreditSales: number;
  totalExpenses: number;
  ocrConfidence: number;
  entries: RecordBookEntry[];
  paytmUpiRevenueToday: number;
  reconciledTotalVyapaar: number; // Cash + UPI
  actionableInsightsIndic: string;
}

export interface LostRevenueMetrics {
  merchantId: string;
  date: string;
  expectedRevenueToday: number;
  actualRevenueSoFar: number;
  shortfallAmount: number;
  isShortfallAlertTriggered: boolean;
  lostRevenueCauses: {
    stockoutsOnTopSKUs: number; // e.g. ₹4,200/wk
    churnToQuickCommerce: number; // e.g. ₹60,900 at risk
    slowHoursShortfall: number;
  };
  remedialActionRecommended: {
    actionType: 'FLASH_CASHBACK_CAMPAIGN' | 'STOCK_REPLENISHMENT' | 'OFFER_BROADCAST';
    title: string;
    descriptionIndic: string;
    expectedRecoveryAmount: number;
  };
}

export interface MarketBenchmarkData {
  merchantId: string;
  pincode: string;
  neighborhoodName: string;
  metrics: {
    dailyRevenuePercentile: number; // e.g. 78th percentile in Govind Nagar
    avgTicketSizeMerchant: number;  // e.g. ₹285
    avgTicketSizePincode: number;   // e.g. ₹220
    upiAdoptionRateMerchant: number;// e.g. 84%
    upiAdoptionRatePincode: number; // e.g. 68%
    distributorPriceEfficiency: number; // e.g. 92% (8% overpayment detected)
  };
  competitiveEdgeSummaryIndic: string;
}

export interface FestivalReadinessPlan {
  festivalName: string;
  festivalDate: string;
  daysRemaining: number;
  expectedDemandUpliftPercentage: number;
  recommendedCategoryCushions: Array<{
    category: string;
    recommendedStockMultiplier: number;
    recommendedOrderDeadline: string;
    topSKUs: string[];
  }>;
  specialDistributorDiscountsActive: boolean;
  actionChecklistIndic: string[];
}

export interface MerchantVoiceQueryRequest {
  merchantId: string;
  storeId: string;
  queryText: string;
  language?: IndicLanguage;
  currentHour?: number;
  ambientTemperatureC?: number;
}

export interface MerchantVoiceQueryResponse {
  queryText: string;
  intentRecognized: 'INVENTORY_PURCHASE_ADVICE' | 'SALES_STATUS' | 'PEAK_HOUR' | 'CAMPAIGN_STATUS' | 'GENERAL_HELP';
  responseSpeechIndic: string;
  audioUrl?: string;
  actionButton?: {
    labelIndic: string;
    actionType: string;
    payload: any;
  };
}

