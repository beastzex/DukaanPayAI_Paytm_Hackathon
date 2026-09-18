import { Request, Response, NextFunction } from 'express';
export declare class NotificationController {
    private service;
    constructor();
    sendWhatsApp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    triggerVoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=NotificationController.d.ts.map