import { Request, Response, NextFunction } from 'express';
import { HealthScoreService } from '../services/HealthScoreService';
import { ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse } from '@dukaanpay/shared-types';

export class HealthScoreController {
  private service: HealthScoreService;

  constructor() {
    this.service = new HealthScoreService();
  }

  public evaluate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.body.merchantId as string) || (req.headers['x-merchant-id'] as string);
      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const {
        dailyRevenueStabilityIndex,
        stockoutAvoidanceRatio,
        customerRetentionRatio,
        supplierPaymentDiscipline,
        rolling30dRevenue,
      } = req.body;

      const result = await this.service.evaluateHealthScore(
        merchantId,
        {
          dailyRevenueStabilityIndex: dailyRevenueStabilityIndex ?? 82,
          stockoutAvoidanceRatio: stockoutAvoidanceRatio ?? 78,
          customerRetentionRatio: customerRetentionRatio ?? 85,
          supplierPaymentDiscipline: supplierPaymentDiscipline ?? 90,
          rolling30dRevenue: rolling30dRevenue ?? 185000,
        },
        (req.headers['x-correlation-id'] as string) || 'health-calc'
      );

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const score = await this.service.getLatestScore(merchantId);

      res.status(200).json({
        success: true,
        data: score,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getCredit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const credit = await this.service.getCreditLine(merchantId);

      res.status(200).json({
        success: true,
        data: credit,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
