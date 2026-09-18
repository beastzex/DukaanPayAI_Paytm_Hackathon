import { Request, Response, NextFunction } from 'express';
export declare const idempotencyMiddleware: (ttlSeconds?: number) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=idempotency.middleware.d.ts.map