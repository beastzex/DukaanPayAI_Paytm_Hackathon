import Redis from 'ioredis';
import { config } from '../../configs/env.config';
import { logger } from '../../monitoring/logger';

// In-memory fallback map for zero-dependency local execution
const inMemoryCache: Map<string, { value: string; expiresAt?: number }> = new Map();

export class RedisClient {
  private static instance: Redis | null = null;
  private static isConnected = false;

  public static initialize(): Redis | null {
    if (config.USE_IN_MEMORY_DB) {
      logger.info('Redis running in high-performance in-memory emulation mode');
      return null;
    }

    try {
      this.instance = new Redis(config.REDIS_URL, {
        password: config.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 100, 3000);
          logger.warn(`Redis connection retry attempt ${times} in ${delay}ms`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      });

      this.instance.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis client connected successfully');
      });

      this.instance.on('error', (err) => {
        this.isConnected = false;
        logger.error({ err }, 'Redis connection error');
      });

      return this.instance;
    } catch (error) {
      logger.warn({ error }, 'Failed to connect to Redis instance, using in-memory cache fallback');
      this.instance = null;
      return null;
    }
  }

  public static getInstance(): Redis | null {
    if (!this.instance && !config.USE_IN_MEMORY_DB) {
      this.initialize();
    }
    return this.instance;
  }

  // Resilient Cache Operations (handles both live Redis & in-memory fallback)
  public static async get(key: string): Promise<string | null> {
    if (this.instance && this.isConnected) {
      return this.instance.get(key);
    }
    const item = inMemoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      inMemoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  public static async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.instance && this.isConnected) {
      if (ttlSeconds) {
        await this.instance.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.instance.set(key, value);
      }
      return;
    }
    inMemoryCache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  public static async setnx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (this.instance && this.isConnected) {
      const result = await this.instance.set(key, value, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    }
    const existing = await this.get(key);
    if (existing !== null) return false;
    await this.set(key, value, ttlSeconds);
    return true;
  }

  public static async del(key: string): Promise<void> {
    if (this.instance && this.isConnected) {
      await this.instance.del(key);
      return;
    }
    inMemoryCache.delete(key);
  }

  public static async delPattern(pattern: string): Promise<void> {
    if (this.instance && this.isConnected) {
      const keys = await this.instance.keys(pattern);
      if (keys.length > 0) {
        await this.instance.del(...keys);
      }
      return;
    }
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const key of inMemoryCache.keys()) {
      if (regex.test(key)) {
        inMemoryCache.delete(key);
      }
    }
  }
}
