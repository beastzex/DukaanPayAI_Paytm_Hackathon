"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const redis_client_1 = require("../infrastructure/redis/redis-client");
const logger_1 = require("../monitoring/logger");
const rateLimiter = (options = {}) => {
    const windowSeconds = options.windowSeconds || 60;
    const maxRequests = options.maxRequests || 100;
    const prefix = options.keyPrefix || 'ratelimit';
    return async (req, res, next) => {
        const identifier = req.user?.userId || req.ip || 'anonymous';
        const key = `${prefix}:${identifier}`;
        try {
            const current = await redis_client_1.RedisClient.get(key);
            const count = current ? parseInt(current, 10) : 0;
            if (count >= maxRequests) {
                logger_1.logger.warn({ identifier, count, maxRequests }, 'Rate limit exceeded');
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
            await redis_client_1.RedisClient.set(key, String(count + 1), windowSeconds);
            res.setHeader('X-RateLimit-Limit', String(maxRequests));
            res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - count - 1)));
            next();
        }
        catch (err) {
            logger_1.logger.warn({ identifier, error: err }, 'Rate limiting check failed, allowing request through');
            next();
        }
    };
};
exports.rateLimiter = rateLimiter;
//# sourceMappingURL=rate-limiter.middleware.js.map