import { Request, Response, NextFunction } from 'express';
import { IntegrationService } from '../../services/integration.service';
import { z } from 'zod';

const aiActionSchema = z.object({
  merchantId: z.string(),
  actionType: z.enum(['STOCK_RESTOCK', 'WINBACK_CAMPAIGN', 'FESTIVAL_BUFFER', 'UDHAAR_RECOVERY']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string().min(3),
  rationaleIndic: z.string(),
  projectedRevenueINR: z.number(),
  payload: z.record(z.string(), z.any()),
  requiresMerchantApproval: z.boolean().default(true),
});

export class AIIntegrationController {
  private integrationService = new IntegrationService();

  public getMerchantContext = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = req.params.id;
      const context = await this.integrationService.getMerchantAIContext(merchantId);

      res.status(200).json({
        success: true,
        data: context,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public ingestRecommendation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = aiActionSchema.parse(req.body);
      const result = await this.integrationService.ingestAIAction(data);

      res.status(201).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };
}
