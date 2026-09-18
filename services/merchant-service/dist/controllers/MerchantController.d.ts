import { Request, Response, NextFunction } from 'express';
export declare class MerchantController {
    private service;
    constructor();
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePreferences: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MerchantController.d.ts.map