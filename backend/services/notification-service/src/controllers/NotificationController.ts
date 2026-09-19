import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';
import { ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse } from '@dukaanpay/shared-types';

export class NotificationController {
  private service: NotificationService;

  constructor() {
    this.service = new NotificationService();
  }

  public sendWhatsApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId, phoneNumber, templateName, bodyText } = req.body;
      if (!merchantId || !phoneNumber || !bodyText) {
        throw new ValidationError('merchantId, phoneNumber, and bodyText required');
      }

      const notifId = await this.service.sendWhatsAppMessage(
        merchantId,
        phoneNumber,
        templateName || 'custom',
        bodyText,
        (req.headers['x-correlation-id'] as string) || 'notif-send'
      );

      const response: ApiResponse<{ notificationId: string }> = {
        success: true,
        data: { notificationId: notifId },
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

  public triggerVoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId, phoneNumber, speechScriptHindi } = req.body;
      if (!merchantId || !phoneNumber || !speechScriptHindi) {
        throw new ValidationError('merchantId, phoneNumber, and speechScriptHindi required');
      }

      const callId = await this.service.triggerTwilioVoiceCall(
        merchantId,
        phoneNumber,
        speechScriptHindi
      );

      res.status(200).json({
        success: true,
        data: { callId },
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
