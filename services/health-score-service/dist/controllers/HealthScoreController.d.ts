import { Request, Response, NextFunction } from 'express';
export declare class HealthScoreController {
    private service;
    constructor();
    evaluate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getScore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCredit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=HealthScoreController.d.ts.map