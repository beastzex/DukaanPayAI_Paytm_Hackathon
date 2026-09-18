import { Request, Response, NextFunction } from 'express';
export declare class TransactionController {
    private service;
    constructor();
    ingest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getVelocity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHourlyDistribution: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLostRevenue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMarketBenchmark: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=TransactionController.d.ts.map