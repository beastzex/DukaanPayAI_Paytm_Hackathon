import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../../services/analytics.service';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.analyticsService.getPlatformMetrics();
      res.status(200).json({
        success: true,
        data: metrics,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = (req.query.actorId as string) || req.user?.userId || 'system';
      const logs = await this.analyticsService.getAuditLogs(actorId);

      res.status(200).json({
        success: true,
        data: logs,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };
}
