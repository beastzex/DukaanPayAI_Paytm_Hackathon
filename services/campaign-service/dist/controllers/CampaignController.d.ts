import { Request, Response, NextFunction } from 'express';
export declare class CampaignController {
    private service;
    constructor();
    draft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approve: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=CampaignController.d.ts.map