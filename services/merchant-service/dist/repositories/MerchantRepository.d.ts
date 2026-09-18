import { Merchant, Store, SubscriptionTier, IndicLanguage } from '@dukaanpay/shared-types';
export interface CreateMerchantParams {
    phoneNumber: string;
    fullName: string;
    businessName: string;
    email?: string;
    preferredLanguage: IndicLanguage;
    subscriptionTier: SubscriptionTier;
}
export interface CreateStoreParams {
    merchantId: string;
    storeName: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    soundboxDeviceId?: string;
    upiVpa: string;
}
export declare class MerchantRepository {
    findById(id: string): Promise<Merchant | null>;
    findByPhoneNumber(phoneNumber: string): Promise<Merchant | null>;
    createMerchant(params: CreateMerchantParams): Promise<Merchant>;
    createStore(params: CreateStoreParams): Promise<Store>;
    findStoresByMerchantId(merchantId: string): Promise<Store[]>;
    updatePreferences(merchantId: string, preferredLanguage: IndicLanguage, subscriptionTier: SubscriptionTier): Promise<Merchant | null>;
}
//# sourceMappingURL=MerchantRepository.d.ts.map