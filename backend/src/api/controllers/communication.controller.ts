import { Request, Response, NextFunction } from 'express';
import { CommunicationService } from '../../services/communication.service';
import { NotificationChannel } from '../../domain/entities/entities';
import { z } from 'zod';

const sendWhatsAppSchema = z.object({
  merchantId: z.string(),
  recipient: z.string().min(10),
  content: z.string().min(1),
  campaignId: z.string().optional(),
  priority: z.number().int().min(1).max(10).default(5),
});

const initiateVoiceSchema = z.object({
  merchantId: z.string(),
  recipient: z.string().min(10),
  merchantName: z.string().optional(),
  twimlScript: z.string().optional(),
});

export class CommunicationController {
  private commService = new CommunicationService();

  public sendWhatsApp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = sendWhatsAppSchema.parse(req.body);
      const result = await this.commService.sendWhatsAppMessage({
        ...data,
        channel: NotificationChannel.WHATSAPP,
      });

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public initiateCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = initiateVoiceSchema.parse(req.body);
      const result = await this.commService.initiateVoiceCall(data);

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };
}
