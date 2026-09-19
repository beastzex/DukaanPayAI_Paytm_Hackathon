import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../../services/merchant.service';
import { z } from 'zod';

const registerMerchantSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  phoneNumber: z.string().min(10),
  email: z.string().email().optional(),
  category: z.string().default('Kirana & FMCG'),
  pincode: z.string().min(6),
  city: z.string(),
  state: z.string(),
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('VERIFIED'),
  preferredLanguage: z.string().default('hi'),
  settings: z.record(z.string(), z.any()).default({}),
});

const updateSettingsSchema = z.object({
  settings: z.record(z.string(), z.any()),
  version: z.number().int().min(1),
});

export class MerchantController {
  private merchantService = new MerchantService();

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = req.params.id;
      const profile = await this.merchantService.getProfile(merchantId);

      res.status(200).json({
        success: true,
        data: profile,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerMerchantSchema.parse(req.body);
      const merchant = await this.merchantService.register(data);

      res.status(201).json({
        success: true,
        data: merchant,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = req.params.id;
      const { settings, version } = updateSettingsSchema.parse(req.body);
      const updated = await this.merchantService.updateSettings(merchantId, settings, version);

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };
}
