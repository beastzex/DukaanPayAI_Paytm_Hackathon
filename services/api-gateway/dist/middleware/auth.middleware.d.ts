import { Request, Response, NextFunction } from 'express';
import { AuthClaims, UserRole } from '@dukaanpay/shared-types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthClaims;
        }
    }
}
export declare const authenticateJwt: (req: Request, _res: Response, next: NextFunction) => void;
export declare const authorizeRoles: (...allowedRoles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map