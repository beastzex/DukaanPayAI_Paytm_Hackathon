import { Request, Response, NextFunction } from 'express';
export declare class TwilioWebhookValidator {
    /**
     * Middleware to validate Twilio X-Twilio-Signature on incoming Webhooks and callbacks.
     * Rejects forged or unsigned requests with 401 Unauthorized.
     */
    static validate(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=twilio-webhook-validator.d.ts.map