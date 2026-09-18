import { Request, Response, NextFunction } from 'express';
export declare class CommunicationController {
    private commService;
    sendWhatsApp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    initiateCall: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=communication.controller.d.ts.map