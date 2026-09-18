import { CampaignEntity, NotificationChannel } from '../domain/entities/entities';
export interface CreateCampaignDto {
    merchantId: string;
    title: string;
    targetSegment: string;
    channel?: NotificationChannel;
    templateSlug: string;
    templateParameters: Record<string, any>;
    scheduledAt?: Date;
    audienceCount: number;
}
export declare class CampaignService {
    private campaignRepo;
    createCampaign(dto: CreateCampaignDto): Promise<CampaignEntity>;
    triggerExecution(campaignId: string): Promise<CampaignEntity>;
    getCampaigns(merchantId: string): Promise<CampaignEntity[]>;
}
//# sourceMappingURL=campaign.service.d.ts.map