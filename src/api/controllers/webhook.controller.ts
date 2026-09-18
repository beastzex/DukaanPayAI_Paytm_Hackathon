import { Request, Response, NextFunction } from 'express';
import { IntegrationService } from '../../services/integration.service';
import { WebhookEngine } from '../../integrations/webhooks/webhook-engine';
import { logger } from '../../monitoring/logger';
import { z } from 'zod';

const registerWebhookSchema = z.object({
  merchantId: z.string(),
  targetUrl: z.string().url(),
  subscribedEvents: z.array(z.string()).min(1),
});

export class WebhookController {
  private integrationService = new IntegrationService();

  public handleTwilioMessageStatus = async (req: Request, res: Response): Promise<void> => {
    const { MessageSid, MessageStatus, To, From, ErrorCode } = req.body;
    logger.info({ MessageSid, MessageStatus, To, From, ErrorCode }, 'Received Twilio WhatsApp delivery status update');
    res.status(200).send('<Response></Response>');
  };

  public handleTwilioVoiceStatus = async (req: Request, res: Response): Promise<void> => {
    const { CallSid, CallStatus, Duration, From, To } = req.body;
    logger.info({ CallSid, CallStatus, Duration, From, To }, 'Received Twilio Voice call status update');
    res.status(200).send('<Response></Response>');
  };

  public handleTwilioIVRCallback = async (req: Request, res: Response): Promise<void> => {
    const { Digits, CallSid } = req.body;
    logger.info({ CallSid, Digits }, 'Received merchant DTMF keypad input');

    let twimlResponse = '';
    if (Digits === '1') {
      twimlResponse =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<Response>\n' +
        '    <Say voice="Polly.Aditi" language="hi-IN">धन्यवाद! आपका अभियान तुरंत स्वीकृत कर भेज दिया गया है।</Say>\n' +
        '</Response>';
    } else {
      twimlResponse =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<Response>\n' +
        '    <Say voice="Polly.Aditi" language="hi-IN">ठीक है, अभियान अभी नहीं भेजा जाएगा। धन्यवाद।</Say>\n' +
        '</Response>';
    }

    res.set('Content-Type', 'text/xml');
    res.status(200).send(twimlResponse);
  };

  public registerWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerWebhookSchema.parse(req.body);
      const sub = await this.integrationService.registerWebhook(
        data.merchantId,
        data.targetUrl,
        data.subscribedEvents
      );

      res.status(201).json({
        success: true,
        data: sub,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public getDeliveryLogs = async (req: Request, res: Response): Promise<void> => {
    const logs = WebhookEngine.getDeliveryLogs();
    res.status(200).json({
      success: true,
      data: { logs, dlqCount: WebhookEngine.getDLQCount() },
      meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
    });
  };

  public replayDLQ = async (req: Request, res: Response): Promise<void> => {
    const index = parseInt(req.body.index || '0', 10);
    const success = await WebhookEngine.replayDLQ(index);
    res.status(200).json({
      success,
      data: { message: success ? 'DLQ webhook replayed successfully' : 'DLQ index not found' },
    });
  };
}
