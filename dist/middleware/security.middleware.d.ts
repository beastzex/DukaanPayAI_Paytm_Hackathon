import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const corsPolicy: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const inputSanitizer: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.middleware.d.ts.map