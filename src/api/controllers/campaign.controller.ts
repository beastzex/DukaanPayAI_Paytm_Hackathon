import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign.service';
import { NotificationChannel } from '../../domain/entities/entities';
import { z } from 'zod';

const createCampaignSchema = z.object({
  merchantId: z.string(),
  title: z.string().min(3),
  targetSegment: z.string(),
  channel: z.enum(['WHATSAPP', 'VOICE', 'SMS', 'EMAIL']).default('WHATSAPP'),
  templateSlug: z.string(),
  templateParameters: z.record(z.string(), z.any()).default({}),
  scheduledAt: z.string().datetime().optional(),
  audienceCount: z.number().int().min(1),
});

export class CampaignController {
  private campaignService = new CampaignService();

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createCampaignSchema.parse(req.body);
      const campaign = await this.campaignService.createCampaign({
        ...data,
        channel: data.channel as NotificationChannel,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      });

      res.status(201).json({
        success: true,
        data: campaign,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const campaignId = req.params.id;
      const campaign = await this.campaignService.triggerExecution(campaignId);

      res.status(200).json({
        success: true,
        data: campaign,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public listByMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = req.params.merchantId;
      const campaigns = await this.campaignService.getCampaigns(merchantId);

      res.status(200).json({
        success: true,
        data: campaigns,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };
}
