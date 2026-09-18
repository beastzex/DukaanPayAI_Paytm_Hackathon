"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRecommendationSchema = exports.ApproveCampaignSchema = exports.DraftCampaignSchema = exports.UpdateStockSchema = exports.CreateSKUSchema = exports.IngestTransactionSchema = exports.RefreshTokenSchema = exports.LoginMerchantSchema = exports.RegisterMerchantSchema = void 0;
const zod_1 = require("zod");
const shared_types_1 = require("@dukaanpay/shared-types");
// Auth Schemas
exports.RegisterMerchantSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(/^\+91[6-9]\d{9}$/, 'Must be a valid Indian phone number (+91...)'),
    fullName: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(120),
    businessName: zod_1.z.string().min(2, 'Business name must be at least 2 characters').max(200),
    email: zod_1.z.string().email('Invalid email address').optional(),
    preferredLanguage: zod_1.z.nativeEnum(shared_types_1.IndicLanguage).default(shared_types_1.IndicLanguage.HINDI),
    subscriptionTier: zod_1.z.nativeEnum(shared_types_1.SubscriptionTier).default(shared_types_1.SubscriptionTier.STARTER),
    upiVpa: zod_1.z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Valid UPI VPA required (e.g. merchant@paytm)'),
    addressLine: zod_1.z.string().min(5),
    city: zod_1.z.string().min(2),
    state: zod_1.z.string().min(2),
    pincode: zod_1.z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit Indian PIN code'),
    soundboxDeviceId: zod_1.z.string().optional(),
});
exports.LoginMerchantSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(/^\+91[6-9]\d{9}$/, 'Must be a valid Indian phone number (+91...)'),
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(20, 'Refresh token required'),
});
// Transaction Schemas
exports.IngestTransactionSchema = zod_1.z.object({
    merchantId: zod_1.z.string().uuid(),
    storeId: zod_1.z.string().uuid(),
    soundboxDeviceId: zod_1.z.string().optional(),
    txnReferenceId: zod_1.z.string().min(5),
    payerVpaMasked: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive('Transaction amount must be positive'),
    paymentMode: zod_1.z.nativeEnum(shared_types_1.PaymentMode).default(shared_types_1.PaymentMode.UPI),
    capturedAt: zod_1.z.string().datetime({ offset: true }).or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T/)),
});
// Inventory Schemas
exports.CreateSKUSchema = zod_1.z.object({
    skuCode: zod_1.z.string().min(2).max(64),
    productName: zod_1.z.string().min(2).max(200),
    category: zod_1.z.string().min(2).max(100),
    brand: zod_1.z.string().max(100).optional(),
    unitOfMeasure: zod_1.z.string().default('unit'),
    standardMrp: zod_1.z.number().positive(),
    avgPurchasePrice: zod_1.z.number().positive(),
    sellingPrice: zod_1.z.number().positive(),
    initialStock: zod_1.z.number().nonnegative().default(0),
    reorderPoint: zod_1.z.number().positive().default(10),
    safetyStock: zod_1.z.number().nonnegative().default(5),
});
exports.UpdateStockSchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid(),
    skuId: zod_1.z.string().uuid(),
    unitsToAdd: zod_1.z.number(),
    reason: zod_1.z.enum(['PURCHASE_RECEIPT', 'STOCK_AUDIT', 'SALE_CORRECTION', 'DAMAGE_RETURN']),
});
// Campaign Schemas
exports.DraftCampaignSchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(3).max(200),
    targetSegment: zod_1.z.enum(['CHURN_RISK_HIGH', 'LOYAL_VIP', 'LAPSED_REGULAR', 'ALL_CUSTOMERS']),
    templateSlug: zod_1.z.string().min(2),
    parameters: zod_1.z.record(zod_1.z.any()),
    scheduledAt: zod_1.z.string().datetime().optional(),
});
exports.ApproveCampaignSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid(),
    approvalStatus: zod_1.z.enum(['APPROVED', 'REJECTED']),
    approvalSource: zod_1.z.enum(['WHATSAPP_TAP', 'VOICE_PROMPT', 'APP_TAP']),
});
// Health Score & Recommendations
exports.ActionRecommendationSchema = zod_1.z.object({
    action: zod_1.z.enum(['APPLY', 'DISMISS']),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=index.js.map