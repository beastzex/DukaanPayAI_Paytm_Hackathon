import { Request, Response, NextFunction } from 'express';
export interface RateLimiterOptions {
    windowSeconds?: number;
    maxRequests?: number;
    keyPrefix?: string;
}
export declare const rateLimiter: (options?: RateLimiterOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rate-limiter.middleware.d.ts.map