import { Request, Response, NextFunction } from 'express';
import { AppError } from '@dukaanpay/common-utils';
export declare const errorMiddleware: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map