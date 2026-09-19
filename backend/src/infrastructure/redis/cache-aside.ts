import { RedisClient } from './redis-client';
import { cacheHitsTotal, cacheMissesTotal } from '../../monitoring/metrics';
import { logger } from '../../monitoring/logger';
import { config } from '../../configs/env.config';

export class CacheAside {
  /**
   * Retrieves an item from Redis cache or fetches from primary DB and warms the cache.
   */
  public static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = config.REDIS_CACHE_DEFAULT_TTL,
    namespace = 'default'
  ): Promise<T> {
    try {
      const cached = await RedisClient.get(key);
      if (cached) {
        cacheHitsTotal.inc({ namespace });
        logger.debug({ key, namespace }, 'Cache HIT');
        return JSON.parse(cached) as T;
      }
    } catch (err) {
      logger.warn({ key, error: err }, 'Failed reading from cache, falling back to database fetcher');
    }

    cacheMissesTotal.inc({ namespace });
    logger.debug({ key, namespace }, 'Cache MISS');

    const freshData = await fetcher();

    if (freshData !== null && freshData !== undefined) {
      try {
        await RedisClient.set(key, JSON.stringify(freshData), ttlSeconds);
        logger.debug({ key, ttlSeconds }, 'Cache WARMED');
      } catch (err) {
        logger.warn({ key, error: err }, 'Failed warming cache');
      }
    }

    return freshData;
  }

  public static async invalidate(key: string): Promise<void> {
    logger.info({ key }, 'Invalidating cache key');
    await RedisClient.del(key);
  }

  public static async invalidatePattern(pattern: string): Promise<void> {
    logger.info({ pattern }, 'Invalidating cache pattern');
    await RedisClient.delPattern(pattern);
  }
}
