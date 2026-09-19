import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/TransactionService';
import { IngestTransactionSchema } from '@dukaanpay/shared-validators';
import { ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse } from '@dukaanpay/shared-types';

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  public ingest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = IngestTransactionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid transaction payload', parsed.error.format());
      }

      const txn = await this.service.ingestTransaction(
        parsed.data,
        (req.headers['x-correlation-id'] as string) || 'txn-ingest'
      );

      const response: ApiResponse<typeof txn> = {
        success: true,
        data: txn,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getVelocity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;

      if (!merchantId) {
        throw new ValidationError('merchantId query param or header required');
      }

      const velocity = await this.service.getVelocityAnalytics(merchantId, days);

      res.status(200).json({
        success: true,
        data: velocity,
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

  public getHourlyDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      if (!merchantId) {
        throw new ValidationError('merchantId query param or header required');
      }

      const distribution = await this.service.getHourlyFootfallPattern(merchantId, days);

      res.status(200).json({
        success: true,
        data: distribution,
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

  public getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const history = await this.service.getHistory(merchantId, limit);

      res.status(200).json({
        success: true,
        data: history,
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

  public getLostRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string) || 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const analysis = await this.service.getLostRevenue(merchantId);

      res.status(200).json({
        success: true,
        data: analysis,
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

  public getMarketBenchmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string) || 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const benchmark = await this.service.getMarketBenchmark(merchantId);

      res.status(200).json({
        success: true,
        data: benchmark,
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
