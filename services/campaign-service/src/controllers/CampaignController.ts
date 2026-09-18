import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/CampaignService';
import { DraftCampaignSchema, ApproveCampaignSchema } from '@dukaanpay/shared-validators';
import { ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse } from '@dukaanpay/shared-types';

export class CampaignController {
  private service: CampaignService;

  constructor() {
    this.service = new CampaignService();
  }

  public draft = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = DraftCampaignSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid campaign draft', parsed.error.format());
      }

      const merchantId = (req.body.merchantId as string) || (req.headers['x-merchant-id'] as string);
      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const campaign = await this.service.draftCampaign(
        merchantId,
        parsed.data,
        (req.headers['x-correlation-id'] as string) || 'campaign-draft'
      );

      const response: ApiResponse<typeof campaign> = {
        success: true,
        data: campaign,
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

  public approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ApproveCampaignSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid campaign approval payload', parsed.error.format());
      }

      const campaign = await this.service.handleApproval(
        parsed.data,
        (req.headers['x-correlation-id'] as string) || 'campaign-approval'
      );

      res.status(200).json({
        success: true,
        data: campaign,
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

  public getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = (req.query.merchantId as string) || (req.headers['x-merchant-id'] as string);
      if (!merchantId) {
        throw new ValidationError('merchantId required');
      }

      const campaigns = await this.service.getMerchantCampaigns(merchantId);

      res.status(200).json({
        success: true,
        data: campaigns,
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
