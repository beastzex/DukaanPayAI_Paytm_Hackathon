import { Request, Response } from 'express';
export interface HealthCheckStatus {
    status: 'UP' | 'DOWN';
    timestamp: string;
    uptimeSeconds: number;
    memoryUsage: NodeJS.MemoryUsage;
    services: Record<string, {
        status: 'UP' | 'DOWN';
        latencyMs?: number;
        message?: string;
    }>;
}
export declare const livenessHandler: (_req: Request, res: Response) => void;
export declare const readinessHandler: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=health.d.ts.map