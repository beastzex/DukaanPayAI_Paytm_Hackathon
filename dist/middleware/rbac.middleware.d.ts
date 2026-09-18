import { Request, Response, NextFunction } from 'express';
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const authorizePermissions: (...requiredPermissions: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map