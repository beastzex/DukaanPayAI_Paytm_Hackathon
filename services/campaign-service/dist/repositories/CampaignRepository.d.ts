import { Campaign, CampaignStatus, NotificationChannel } from '@dukaanpay/shared-types';
export interface CreateCampaignParams {
    merchantId: string;
    storeId: string;
    title: string;
    targetSegment: string;
    channel: NotificationChannel;
    templateSlug: string;
    parameters: any;
    scheduledAt?: Date;
}
export interface CampaignResultDetail {
    campaign: Campaign;
    recipientsTargeted: number;
    messagesDelivered: number;
    messagesRead: number;
    offersRedeemed: number;
    incrementalRevenue: number;
    costIncurred: number;
    roiMultiple: number;
}
export declare class CampaignRepository {
    createCampaign(params: CreateCampaignParams): Promise<Campaign>;
    findById(id: string): Promise<Campaign | null>;
    updateApprovalStatus(id: string, status: CampaignStatus): Promise<Campaign | null>;
    recordExecution(id: string, recipientsCount: number, incrementalRevenue: number, cost: number): Promise<void>;
    getMerchantCampaigns(merchantId: string): Promise<Campaign[]>;
}
//# sourceMappingURL=CampaignRepository.d.ts.map