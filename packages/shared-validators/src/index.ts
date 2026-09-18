import { z } from 'zod';
import { IndicLanguage, SubscriptionTier, PaymentMode, CampaignStatus } from '@dukaanpay/shared-types';

// Auth Schemas
export const RegisterMerchantSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Must be a valid Indian phone number (+91...)'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(120),
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(200),
  email: z.string().email('Invalid email address').optional(),
  preferredLanguage: z.nativeEnum(IndicLanguage).default(IndicLanguage.HINDI),
  subscriptionTier: z.nativeEnum(SubscriptionTier).default(SubscriptionTier.STARTER),
  upiVpa: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Valid UPI VPA required (e.g. merchant@paytm)'),
  addressLine: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit Indian PIN code'),
  soundboxDeviceId: z.string().optional(),
});

export const LoginMerchantSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Must be a valid Indian phone number (+91...)'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(20, 'Refresh token required'),
});

// Transaction Schemas
export const IngestTransactionSchema = z.object({
  merchantId: z.string().uuid(),
  storeId: z.string().uuid(),
  soundboxDeviceId: z.string().optional(),
  txnReferenceId: z.string().min(5),
  payerVpaMasked: z.string().optional(),
  amount: z.number().positive('Transaction amount must be positive'),
  paymentMode: z.nativeEnum(PaymentMode).default(PaymentMode.UPI),
  capturedAt: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T/)),
});

// Inventory Schemas
export const CreateSKUSchema = z.object({
  skuCode: z.string().min(2).max(64),
  productName: z.string().min(2).max(200),
  category: z.string().min(2).max(100),
  brand: z.string().max(100).optional(),
  unitOfMeasure: z.string().default('unit'),
  standardMrp: z.number().positive(),
  avgPurchasePrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  initialStock: z.number().nonnegative().default(0),
  reorderPoint: z.number().positive().default(10),
  safetyStock: z.number().nonnegative().default(5),
});

export const UpdateStockSchema = z.object({
  storeId: z.string().uuid(),
  skuId: z.string().uuid(),
  unitsToAdd: z.number(),
  reason: z.enum(['PURCHASE_RECEIPT', 'STOCK_AUDIT', 'SALE_CORRECTION', 'DAMAGE_RETURN']),
});

// Campaign Schemas
export const DraftCampaignSchema = z.object({
  storeId: z.string().uuid(),
  title: z.string().min(3).max(200),
  targetSegment: z.enum(['CHURN_RISK_HIGH', 'LOYAL_VIP', 'LAPSED_REGULAR', 'ALL_CUSTOMERS']),
  templateSlug: z.string().min(2),
  parameters: z.record(z.any()),
  scheduledAt: z.string().datetime().optional(),
});

export const ApproveCampaignSchema = z.object({
  campaignId: z.string().uuid(),
  approvalStatus: z.enum(['APPROVED', 'REJECTED']),
  approvalSource: z.enum(['WHATSAPP_TAP', 'VOICE_PROMPT', 'APP_TAP']),
});

// Health Score & Recommendations
export const ActionRecommendationSchema = z.object({
  action: z.enum(['APPLY', 'DISMISS']),
  notes: z.string().optional(),
});

// Types inferred from Zod
export type RegisterMerchantInput = z.infer<typeof RegisterMerchantSchema>;
export type LoginMerchantInput = z.infer<typeof LoginMerchantSchema>;
export type IngestTransactionInput = z.infer<typeof IngestTransactionSchema>;
export type CreateSKUInput = z.infer<typeof CreateSKUSchema>;
export type UpdateStockInput = z.infer<typeof UpdateStockSchema>;
export type DraftCampaignInput = z.infer<typeof DraftCampaignSchema>;
export type ApproveCampaignInput = z.infer<typeof ApproveCampaignSchema>;
export type ActionRecommendationInput = z.infer<typeof ActionRecommendationSchema>;
