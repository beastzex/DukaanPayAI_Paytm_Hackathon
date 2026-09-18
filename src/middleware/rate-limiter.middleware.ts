import { Request, Response, NextFunction } from 'express';
import { RedisClient } from '../infrastructure/redis/redis-client';
import { logger } from '../monitoring/logger';

export interface RateLimiterOptions {
  windowSeconds?: number;
  maxRequests?: number;
  keyPrefix?: string;
}

export const rateLimiter = (options: RateLimiterOptions = {}) => {
  const windowSeconds = options.windowSeconds || 60;
  const maxRequests = options.maxRequests || 100;
  const prefix = options.keyPrefix || 'ratelimit';

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const identifier = req.user?.userId || req.ip || 'anonymous';
    const key = `${prefix}:${identifier}`;

    try {
      const current = await RedisClient.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= maxRequests) {
        logger.warn({ identifier, count, maxRequests }, 'Rate limit exceeded');
        res.setHeader('Retry-After', String(windowSeconds));
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many requests. Limit is ${maxRequests} requests per ${windowSeconds}s.`,
          },
        });
        return;
      }

      await RedisClient.set(key, String(count + 1), windowSeconds);
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - count - 1)));
      next();
    } catch (err) {
      logger.warn({ identifier, error: err }, 'Rate limiting check failed, allowing request through');
      next();
    }
  };
};
