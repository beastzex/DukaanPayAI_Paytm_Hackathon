"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheAside = void 0;
const redis_client_1 = require("./redis-client");
const metrics_1 = require("../../monitoring/metrics");
const logger_1 = require("../../monitoring/logger");
const env_config_1 = require("../../configs/env.config");
class CacheAside {
    /**
     * Retrieves an item from Redis cache or fetches from primary DB and warms the cache.
     */
    static async getOrSet(key, fetcher, ttlSeconds = env_config_1.config.REDIS_CACHE_DEFAULT_TTL, namespace = 'default') {
        try {
            const cached = await redis_client_1.RedisClient.get(key);
            if (cached) {
                metrics_1.cacheHitsTotal.inc({ namespace });
                logger_1.logger.debug({ key, namespace }, 'Cache HIT');
                return JSON.parse(cached);
            }
        }
        catch (err) {
            logger_1.logger.warn({ key, error: err }, 'Failed reading from cache, falling back to database fetcher');
        }
        metrics_1.cacheMissesTotal.inc({ namespace });
        logger_1.logger.debug({ key, namespace }, 'Cache MISS');
        const freshData = await fetcher();
        if (freshData !== null && freshData !== undefined) {
            try {
                await redis_client_1.RedisClient.set(key, JSON.stringify(freshData), ttlSeconds);
                logger_1.logger.debug({ key, ttlSeconds }, 'Cache WARMED');
            }
            catch (err) {
                logger_1.logger.warn({ key, error: err }, 'Failed warming cache');
            }
        }
        return freshData;
    }
    static async invalidate(key) {
        logger_1.logger.info({ key }, 'Invalidating cache key');
        await redis_client_1.RedisClient.del(key);
    }
    static async invalidatePattern(pattern) {
        logger_1.logger.info({ pattern }, 'Invalidating cache pattern');
        await redis_client_1.RedisClient.delPattern(pattern);
    }
}
exports.CacheAside = CacheAside;
//# sourceMappingURL=cache-aside.js.map