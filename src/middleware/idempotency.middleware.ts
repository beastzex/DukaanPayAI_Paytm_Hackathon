import { Request, Response, NextFunction } from 'express';
import { RedisClient } from '../infrastructure/redis/redis-client';
import { logger } from '../monitoring/logger';

export const idempotencyMiddleware = (ttlSeconds = 120) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only apply to mutating requests
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next();
    }

    // Prevent duplicate re-entrant execution if mounted both globally and per-route
    if ((req as any)._idempotencyHandled) {
      return next();
    }
    (req as any)._idempotencyHandled = true;

    const idempotencyKey = req.headers['idempotency-key'] as string;
    if (!idempotencyKey) {
      return next();
    }

    const redisKey = `idempotency:${idempotencyKey}`;
    const lockKey = `idempotency:lock:${idempotencyKey}`;

    // Clean up lock when response finishes or connection closes
    const cleanupLock = () => {
      RedisClient.del(lockKey).catch(() => {});
    };
    res.once('finish', cleanupLock);
    res.once('close', cleanupLock);

    try {
      const cached = await RedisClient.get(redisKey);
      if (cached) {
        logger.info({ idempotencyKey }, 'Idempotency HIT: Returning cached response');
        const parsed = JSON.parse(cached);
        res.setHeader('X-Cache-Lookup', 'IDEMPOTENT_HIT');
        cleanupLock();
        res.status(parsed.status).json(parsed.body);
        return;
      }

      // Acquire in-flight lock to reject concurrent duplicate executions
      const acquired = await RedisClient.setnx(lockKey, 'IN_FLIGHT', 30);
      if (!acquired) {
        logger.warn({ idempotencyKey }, 'Concurrent request with same Idempotency-Key detected');
        res.status(409).json({
          type: 'https://api.dukaanpay.ai/errors/idempotency_conflict',
          title: 'IDEMPOTENCY_CONFLICT',
          status: 409,
          detail: `A request with Idempotency-Key [${idempotencyKey}] is already in progress.`,
          instance: req.originalUrl,
          correlationId: req.correlationId,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Intercept res.json to cache response payload atomically and release lock
      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          RedisClient.set(
            redisKey,
            JSON.stringify({ status: res.statusCode, body }),
            ttlSeconds
          ).catch((err) => logger.warn({ idempotencyKey, error: err }, 'Failed saving idempotency cache'));
        }
        cleanupLock();
        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.warn({ idempotencyKey, error: err }, 'Idempotency check failed, bypassing to request pipeline');
      next();
    }
  };
};
