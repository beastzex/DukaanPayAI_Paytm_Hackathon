import { DraftCampaignInput, ApproveCampaignInput } from '@dukaanpay/shared-validators';
import { Campaign } from '@dukaanpay/shared-types';
export declare class CampaignService {
    private repo;
    private eventBus;
    constructor();
    draftCampaign(merchantId: string, input: DraftCampaignInput, correlationId?: string): Promise<Campaign>;
    handleApproval(input: ApproveCampaignInput, correlationId?: string): Promise<Campaign>;
    getMerchantCampaigns(merchantId: string): Promise<Campaign[]>;
}
//# sourceMappingURL=CampaignService.d.ts.map