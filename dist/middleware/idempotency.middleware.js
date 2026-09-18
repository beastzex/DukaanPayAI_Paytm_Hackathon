"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyMiddleware = void 0;
const redis_client_1 = require("../infrastructure/redis/redis-client");
const logger_1 = require("../monitoring/logger");
const idempotencyMiddleware = (ttlSeconds = 120) => {
    return async (req, res, next) => {
        // Only apply to mutating requests
        if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
            return next();
        }
        // Prevent duplicate re-entrant execution if mounted both globally and per-route
        if (req._idempotencyHandled) {
            return next();
        }
        req._idempotencyHandled = true;
        const idempotencyKey = req.headers['idempotency-key'];
        if (!idempotencyKey) {
            return next();
        }
        const redisKey = `idempotency:${idempotencyKey}`;
        const lockKey = `idempotency:lock:${idempotencyKey}`;
        // Clean up lock when response finishes or connection closes
        const cleanupLock = () => {
            redis_client_1.RedisClient.del(lockKey).catch(() => { });
        };
        res.once('finish', cleanupLock);
        res.once('close', cleanupLock);
        try {
            const cached = await redis_client_1.RedisClient.get(redisKey);
            if (cached) {
                logger_1.logger.info({ idempotencyKey }, 'Idempotency HIT: Returning cached response');
                const parsed = JSON.parse(cached);
                res.setHeader('X-Cache-Lookup', 'IDEMPOTENT_HIT');
                cleanupLock();
                res.status(parsed.status).json(parsed.body);
                return;
            }
            // Acquire in-flight lock to reject concurrent duplicate executions
            const acquired = await redis_client_1.RedisClient.setnx(lockKey, 'IN_FLIGHT', 30);
            if (!acquired) {
                logger_1.logger.warn({ idempotencyKey }, 'Concurrent request with same Idempotency-Key detected');
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
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis_client_1.RedisClient.set(redisKey, JSON.stringify({ status: res.statusCode, body }), ttlSeconds).catch((err) => logger_1.logger.warn({ idempotencyKey, error: err }, 'Failed saving idempotency cache'));
                }
                cleanupLock();
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            logger_1.logger.warn({ idempotencyKey, error: err }, 'Idempotency check failed, bypassing to request pipeline');
            next();
        }
    };
};
exports.idempotencyMiddleware = idempotencyMiddleware;
//# sourceMappingURL=idempotency.middleware.js.map