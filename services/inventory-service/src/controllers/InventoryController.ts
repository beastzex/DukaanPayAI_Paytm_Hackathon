import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/InventoryService';
import { CreateSKUSchema, UpdateStockSchema } from '@dukaanpay/shared-validators';
import { ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse } from '@dukaanpay/shared-types';

export class InventoryController {
  private service: InventoryService;

  constructor() {
    this.service = new InventoryService();
  }

  public createSKU = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateSKUSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid SKU payload', parsed.error.format());
      }

      const merchantId = (req.body.merchantId as string) || (req.headers['x-merchant-id'] as string);
      const storeId = (req.body.storeId as string) || (req.headers['x-store-id'] as string);

      if (!merchantId || !storeId) {
        throw new ValidationError('merchantId and storeId required');
      }

      const result = await this.service.registerSKU(merchantId, storeId, parsed.data);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
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

  public updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = UpdateStockSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid stock update payload', parsed.error.format());
      }

      const updated = await this.service.updateStock(
        parsed.data,
        (req.headers['x-correlation-id'] as string) || 'stock-update'
      );

      res.status(200).json({
        success: true,
        data: updated,
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

  public getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = (req.query.storeId as string) || (req.headers['x-store-id'] as string);
      if (!storeId) {
        throw new ValidationError('storeId query param required');
      }

      const items = await this.service.getInventoryStatus(storeId);

      res.status(200).json({
        success: true,
        data: items,
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

  public getLowStockAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = (req.query.storeId as string) || (req.headers['x-store-id'] as string);
      if (!storeId) {
        throw new ValidationError('storeId query param required');
      }

      const alerts = await this.service.getLowStockAlerts(storeId);

      res.status(200).json({
        success: true,
        data: alerts,
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
