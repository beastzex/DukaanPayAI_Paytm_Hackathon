"use strict";
/**
 * DukaanPayAI – Shared Types & Domain Definitions
 * Enterprise Type Definitions for all Node.js and TypeScript services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthGrade = exports.NotificationStatus = exports.NotificationChannel = exports.CampaignStatus = exports.RecommendationPriority = exports.RecommendationType = exports.ForecastType = exports.TransactionStatus = exports.PaymentMode = exports.IndicLanguage = exports.SubscriptionTier = exports.KycStatus = exports.UserRole = void 0;
// ==========================================
// 1. Core Domain Enums
// ==========================================
var UserRole;
(function (UserRole) {
    UserRole["MERCHANT"] = "MERCHANT";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["AI_AGENT"] = "AI_AGENT";
    UserRole["CREDIT_OFFICER"] = "CREDIT_OFFICER";
})(UserRole || (exports.UserRole = UserRole = {}));
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "PENDING";
    KycStatus["VERIFIED"] = "VERIFIED";
    KycStatus["REJECTED"] = "REJECTED";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["STARTER"] = "STARTER";
    SubscriptionTier["GROWTH_PRO"] = "GROWTH_PRO";
    SubscriptionTier["ENTERPRISE"] = "ENTERPRISE";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
var IndicLanguage;
(function (IndicLanguage) {
    IndicLanguage["HINDI"] = "hi";
    IndicLanguage["ENGLISH"] = "en";
    IndicLanguage["TAMIL"] = "ta";
    IndicLanguage["TELUGU"] = "te";
    IndicLanguage["MARATHI"] = "mr";
    IndicLanguage["BENGALI"] = "bn";
    IndicLanguage["GUJARATI"] = "gu";
    IndicLanguage["KANNADA"] = "kn";
})(IndicLanguage || (exports.IndicLanguage = IndicLanguage = {}));
var PaymentMode;
(function (PaymentMode) {
    PaymentMode["UPI"] = "UPI";
    PaymentMode["CARD"] = "CARD";
    PaymentMode["WALLET"] = "WALLET";
    PaymentMode["NET_BANKING"] = "NET_BANKING";
    PaymentMode["CASH"] = "CASH";
})(PaymentMode || (exports.PaymentMode = PaymentMode = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["REFUNDED"] = "REFUNDED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var ForecastType;
(function (ForecastType) {
    ForecastType["REVENUE_DAILY"] = "REVENUE_DAILY";
    ForecastType["FOOTFALL_HOURLY"] = "FOOTFALL_HOURLY";
    ForecastType["SKU_DEMAND"] = "SKU_DEMAND";
})(ForecastType || (exports.ForecastType = ForecastType = {}));
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["RESTOCK_SKU"] = "RESTOCK_SKU";
    RecommendationType["DISTRIBUTOR_DISPUTE"] = "DISTRIBUTOR_DISPUTE";
    RecommendationType["CHURN_CAMPAIGN"] = "CHURN_CAMPAIGN";
    RecommendationType["PREPARE_PEAK_RUSH"] = "PREPARE_PEAK_RUSH";
    RecommendationType["WORKING_CAPITAL_LOAN"] = "WORKING_CAPITAL_LOAN";
})(RecommendationType || (exports.RecommendationType = RecommendationType = {}));
var RecommendationPriority;
(function (RecommendationPriority) {
    RecommendationPriority["CRITICAL"] = "CRITICAL";
    RecommendationPriority["HIGH"] = "HIGH";
    RecommendationPriority["MEDIUM"] = "MEDIUM";
    RecommendationPriority["LOW"] = "LOW";
})(RecommendationPriority || (exports.RecommendationPriority = RecommendationPriority = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    CampaignStatus["APPROVED"] = "APPROVED";
    CampaignStatus["REJECTED"] = "REJECTED";
    CampaignStatus["EXECUTED"] = "EXECUTED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["VOICE_CALL"] = "VOICE_CALL";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["PUSH"] = "PUSH";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["QUEUED"] = "QUEUED";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["FAILED"] = "FAILED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var HealthGrade;
(function (HealthGrade) {
    HealthGrade["AAA"] = "AAA";
    HealthGrade["AA"] = "AA";
    HealthGrade["A"] = "A";
    HealthGrade["B"] = "B";
    HealthGrade["C"] = "C";
})(HealthGrade || (exports.HealthGrade = HealthGrade = {}));
//# sourceMappingURL=index.js.map