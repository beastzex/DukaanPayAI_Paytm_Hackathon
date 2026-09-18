import { RegisterMerchantInput } from '@dukaanpay/shared-validators';
import { TokenPair } from '@dukaanpay/common-utils';
import { Merchant, Store, IndicLanguage, SubscriptionTier } from '@dukaanpay/shared-types';
export declare class MerchantService {
    private merchantRepo;
    private producer;
    constructor();
    registerMerchant(input: RegisterMerchantInput, correlationId?: string): Promise<{
        merchant: Merchant;
        store: Store;
        tokens: TokenPair;
    }>;
    loginWithOtp(phoneNumber: string, otp: string): Promise<{
        merchant: Merchant;
        tokens: TokenPair;
    }>;
    getProfile(merchantId: string): Promise<{
        merchant: Merchant;
        stores: Store[];
    }>;
    updatePreferences(merchantId: string, language: IndicLanguage, tier: SubscriptionTier, correlationId?: string): Promise<Merchant>;
}
//# sourceMappingURL=MerchantService.d.ts.map