import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || `corr_${randomUUID()}`;
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};
