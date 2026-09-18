import { z } from 'zod';
import { IndicLanguage, SubscriptionTier, PaymentMode } from '@dukaanpay/shared-types';
export declare const RegisterMerchantSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    fullName: z.ZodString;
    businessName: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    preferredLanguage: z.ZodDefault<z.ZodNativeEnum<typeof IndicLanguage>>;
    subscriptionTier: z.ZodDefault<z.ZodNativeEnum<typeof SubscriptionTier>>;
    upiVpa: z.ZodString;
    addressLine: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    pincode: z.ZodString;
    soundboxDeviceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phoneNumber: string;
    fullName: string;
    businessName: string;
    preferredLanguage: IndicLanguage;
    subscriptionTier: SubscriptionTier;
    upiVpa: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    email?: string | undefined;
    soundboxDeviceId?: string | undefined;
}, {
    phoneNumber: string;
    fullName: string;
    businessName: string;
    upiVpa: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    email?: string | undefined;
    preferredLanguage?: IndicLanguage | undefined;
    subscriptionTier?: SubscriptionTier | undefined;
    soundboxDeviceId?: string | undefined;
}>;
export declare const LoginMerchantSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phoneNumber: string;
    otp: string;
}, {
    phoneNumber: string;
    otp: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const IngestTransactionSchema: z.ZodObject<{
    merchantId: z.ZodString;
    storeId: z.ZodString;
    soundboxDeviceId: z.ZodOptional<z.ZodString>;
    txnReferenceId: z.ZodString;
    payerVpaMasked: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    paymentMode: z.ZodDefault<z.ZodNativeEnum<typeof PaymentMode>>;
    capturedAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    merchantId: string;
    storeId: string;
    txnReferenceId: string;
    amount: number;
    paymentMode: PaymentMode;
    capturedAt: string;
    soundboxDeviceId?: string | undefined;
    payerVpaMasked?: string | undefined;
}, {
    merchantId: string;
    storeId: string;
    txnReferenceId: string;
    amount: number;
    capturedAt: string;
    soundboxDeviceId?: string | undefined;
    payerVpaMasked?: string | undefined;
    paymentMode?: PaymentMode | undefined;
}>;
export declare const CreateSKUSchema: z.ZodObject<{
    skuCode: z.ZodString;
    productName: z.ZodString;
    category: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    unitOfMeasure: z.ZodDefault<z.ZodString>;
    standardMrp: z.ZodNumber;
    avgPurchasePrice: z.ZodNumber;
    sellingPrice: z.ZodNumber;
    initialStock: z.ZodDefault<z.ZodNumber>;
    reorderPoint: z.ZodDefault<z.ZodNumber>;
    safetyStock: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    skuCode: string;
    productName: string;
    category: string;
    unitOfMeasure: string;
    standardMrp: number;
    avgPurchasePrice: number;
    sellingPrice: number;
    initialStock: number;
    reorderPoint: number;
    safetyStock: number;
    brand?: string | undefined;
}, {
    skuCode: string;
    productName: string;
    category: string;
    standardMrp: number;
    avgPurchasePrice: number;
    sellingPrice: number;
    brand?: string | undefined;
    unitOfMeasure?: string | undefined;
    initialStock?: number | undefined;
    reorderPoint?: number | undefined;
    safetyStock?: number | undefined;
}>;
export declare const UpdateStockSchema: z.ZodObject<{
    storeId: z.ZodString;
    skuId: z.ZodString;
    unitsToAdd: z.ZodNumber;
    reason: z.ZodEnum<["PURCHASE_RECEIPT", "STOCK_AUDIT", "SALE_CORRECTION", "DAMAGE_RETURN"]>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    skuId: string;
    unitsToAdd: number;
    reason: "PURCHASE_RECEIPT" | "STOCK_AUDIT" | "SALE_CORRECTION" | "DAMAGE_RETURN";
}, {
    storeId: string;
    skuId: string;
    unitsToAdd: number;
    reason: "PURCHASE_RECEIPT" | "STOCK_AUDIT" | "SALE_CORRECTION" | "DAMAGE_RETURN";
}>;
export declare const DraftCampaignSchema: z.ZodObject<{
    storeId: z.ZodString;
    title: z.ZodString;
    targetSegment: z.ZodEnum<["CHURN_RISK_HIGH", "LOYAL_VIP", "LAPSED_REGULAR", "ALL_CUSTOMERS"]>;
    templateSlug: z.ZodString;
    parameters: z.ZodRecord<z.ZodString, z.ZodAny>;
    scheduledAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    title: string;
    targetSegment: "CHURN_RISK_HIGH" | "LOYAL_VIP" | "LAPSED_REGULAR" | "ALL_CUSTOMERS";
    templateSlug: string;
    parameters: Record<string, any>;
    scheduledAt?: string | undefined;
}, {
    storeId: string;
    title: string;
    targetSegment: "CHURN_RISK_HIGH" | "LOYAL_VIP" | "LAPSED_REGULAR" | "ALL_CUSTOMERS";
    templateSlug: string;
    parameters: Record<string, any>;
    scheduledAt?: string | undefined;
}>;
export declare const ApproveCampaignSchema: z.ZodObject<{
    campaignId: z.ZodString;
    approvalStatus: z.ZodEnum<["APPROVED", "REJECTED"]>;
    approvalSource: z.ZodEnum<["WHATSAPP_TAP", "VOICE_PROMPT", "APP_TAP"]>;
}, "strip", z.ZodTypeAny, {
    campaignId: string;
    approvalStatus: "APPROVED" | "REJECTED";
    approvalSource: "WHATSAPP_TAP" | "VOICE_PROMPT" | "APP_TAP";
}, {
    campaignId: string;
    approvalStatus: "APPROVED" | "REJECTED";
    approvalSource: "WHATSAPP_TAP" | "VOICE_PROMPT" | "APP_TAP";
}>;
export declare const ActionRecommendationSchema: z.ZodObject<{
    action: z.ZodEnum<["APPLY", "DISMISS"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "APPLY" | "DISMISS";
    notes?: string | undefined;
}, {
    action: "APPLY" | "DISMISS";
    notes?: string | undefined;
}>;
export type RegisterMerchantInput = z.infer<typeof RegisterMerchantSchema>;
export type LoginMerchantInput = z.infer<typeof LoginMerchantSchema>;
export type IngestTransactionInput = z.infer<typeof IngestTransactionSchema>;
export type CreateSKUInput = z.infer<typeof CreateSKUSchema>;
export type UpdateStockInput = z.infer<typeof UpdateStockSchema>;
export type DraftCampaignInput = z.infer<typeof DraftCampaignSchema>;
export type ApproveCampaignInput = z.infer<typeof ApproveCampaignSchema>;
export type ActionRecommendationInput = z.infer<typeof ActionRecommendationSchema>;
//# sourceMappingURL=index.d.ts.map