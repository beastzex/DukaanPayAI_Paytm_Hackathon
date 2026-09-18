import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedUserPayload {
    userId: string;
    merchantId?: string;
    roles: string[];
    permissions: string[];
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUserPayload;
            token?: string;
        }
    }
}
export declare const authenticateJwt: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map