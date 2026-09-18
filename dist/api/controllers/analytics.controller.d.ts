import { Request, Response, NextFunction } from 'express';
export declare class AnalyticsController {
    private analyticsService;
    getMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAuditLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=analytics.controller.d.ts.map