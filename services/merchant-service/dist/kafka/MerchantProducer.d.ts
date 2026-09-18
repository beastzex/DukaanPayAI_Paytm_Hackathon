import { Merchant } from '@dukaanpay/shared-types';
export declare class MerchantProducer {
    private eventBus;
    constructor();
    publishMerchantCreated(merchant: Merchant, correlationId?: string): Promise<void>;
    publishMerchantUpdated(merchant: Merchant, correlationId?: string): Promise<void>;
}
//# sourceMappingURL=MerchantProducer.d.ts.map