import { Request, Response, NextFunction } from 'express';
export declare class WebhookController {
    private integrationService;
    handleTwilioMessageStatus: (req: Request, res: Response) => Promise<void>;
    handleTwilioVoiceStatus: (req: Request, res: Response) => Promise<void>;
    handleTwilioIVRCallback: (req: Request, res: Response) => Promise<void>;
    registerWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDeliveryLogs: (req: Request, res: Response) => Promise<void>;
    replayDLQ: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=webhook.controller.d.ts.map