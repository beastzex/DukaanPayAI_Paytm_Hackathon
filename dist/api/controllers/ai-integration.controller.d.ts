import { Request, Response, NextFunction } from 'express';
export declare class AIIntegrationController {
    private integrationService;
    getMerchantContext: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    ingestRecommendation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ai-integration.controller.d.ts.map