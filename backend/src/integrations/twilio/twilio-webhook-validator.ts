import { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';
import { config } from '../../configs/env.config';
import { logger } from '../../monitoring/logger';

export class TwilioWebhookValidator {
  /**
   * Middleware to validate Twilio X-Twilio-Signature on incoming Webhooks and callbacks.
   * Rejects forged or unsigned requests with 401 Unauthorized.
   */
  public static validate(req: Request, res: Response, next: NextFunction): void {
    // In local development with placeholder tokens, allow bypass with warning
    if (config.NODE_ENV === 'development' && config.TWILIO_AUTH_TOKEN.includes('placeholder')) {
      logger.debug('Skipping Twilio signature check in local placeholder mode');
      return next();
    }

    const signature = req.headers['x-twilio-signature'] as string;

    if (!signature) {
      logger.warn({ ip: req.ip, path: req.path }, 'Rejected Twilio webhook: Missing X-Twilio-Signature header');
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED_WEBHOOK', message: 'Missing X-Twilio-Signature header' },
      });
      return;
    }

    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const params = req.body || {};

    const isValid = twilio.validateRequest(
      config.TWILIO_AUTH_TOKEN,
      signature,
      fullUrl,
      params
    );

    if (!isValid) {
      logger.warn({ ip: req.ip, signature, url: fullUrl }, 'Rejected Twilio webhook: Invalid cryptographic signature');
      res.status(401).json({
        success: false,
        error: { code: 'FORGED_WEBHOOK_SIGNATURE', message: 'Cryptographic signature verification failed' },
      });
      return;
    }

    logger.debug('Twilio webhook signature verified successfully');
    next();
  }
}
