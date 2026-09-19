import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const incomingId = (req.headers['x-correlation-id'] as string) || (req.headers['x-request-id'] as string);
  const correlationId = incomingId || `corr_${uuidv4()}`;

  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  next();
};
