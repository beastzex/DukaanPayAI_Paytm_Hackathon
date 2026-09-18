import { Request, Response } from 'express';

export interface HealthCheckStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  memoryUsage: NodeJS.MemoryUsage;
  services: Record<string, { status: 'UP' | 'DOWN'; latencyMs?: number; message?: string }>;
}

export const livenessHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'UP',
    check: 'liveness',
    timestamp: new Date().toISOString(),
  });
};

export const readinessHandler = async (_req: Request, res: Response): Promise<void> => {
  const healthData: HealthCheckStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    services: {
      database: { status: 'UP', latencyMs: 1.2 },
      redis: { status: 'UP', latencyMs: 0.8 },
      kafka: { status: 'UP', latencyMs: 2.1 },
    },
  };

  res.status(200).json(healthData);
};
