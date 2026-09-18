import { Request, Response, NextFunction } from 'express';
export declare class MerchantController {
    private merchantService;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=merchant.controller.d.ts.map