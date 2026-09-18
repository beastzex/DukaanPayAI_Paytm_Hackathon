import { Request, Response, NextFunction } from 'express';
export declare class CampaignController {
    private campaignService;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    execute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listByMerchant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=campaign.controller.d.ts.map