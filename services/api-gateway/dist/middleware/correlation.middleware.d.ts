import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            correlationId: string;
        }
    }
}
export declare const correlationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=correlation.middleware.d.ts.map