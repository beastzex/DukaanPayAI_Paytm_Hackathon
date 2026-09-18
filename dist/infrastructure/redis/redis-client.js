"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_config_1 = require("../../configs/env.config");
const logger_1 = require("../../monitoring/logger");
// In-memory fallback map for zero-dependency local execution
const inMemoryCache = new Map();
class RedisClient {
    static instance = null;
    static isConnected = false;
    static initialize() {
        if (env_config_1.config.USE_IN_MEMORY_DB) {
            logger_1.logger.info('Redis running in high-performance in-memory emulation mode');
            return null;
        }
        try {
            this.instance = new ioredis_1.default(env_config_1.config.REDIS_URL, {
                password: env_config_1.config.REDIS_PASSWORD || undefined,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 100, 3000);
                    logger_1.logger.warn(`Redis connection retry attempt ${times} in ${delay}ms`);
                    return delay;
                },
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
            });
            this.instance.on('connect', () => {
                this.isConnected = true;
                logger_1.logger.info('Redis client connected successfully');
            });
            this.instance.on('error', (err) => {
                this.isConnected = false;
                logger_1.logger.error({ err }, 'Redis connection error');
            });
            return this.instance;
        }
        catch (error) {
            logger_1.logger.warn({ error }, 'Failed to connect to Redis instance, using in-memory cache fallback');
            this.instance = null;
            return null;
        }
    }
    static getInstance() {
        if (!this.instance && !env_config_1.config.USE_IN_MEMORY_DB) {
            this.initialize();
        }
        return this.instance;
    }
    // Resilient Cache Operations (handles both live Redis & in-memory fallback)
    static async get(key) {
        if (this.instance && this.isConnected) {
            return this.instance.get(key);
        }
        const item = inMemoryCache.get(key);
        if (!item)
            return null;
        if (item.expiresAt && Date.now() > item.expiresAt) {
            inMemoryCache.delete(key);
            return null;
        }
        return item.value;
    }
    static async set(key, value, ttlSeconds) {
        if (this.instance && this.isConnected) {
            if (ttlSeconds) {
                await this.instance.set(key, value, 'EX', ttlSeconds);
            }
            else {
                await this.instance.set(key, value);
            }
            return;
        }
        inMemoryCache.set(key, {
            value,
            expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
        });
    }
    static async setnx(key, value, ttlSeconds) {
        if (this.instance && this.isConnected) {
            const result = await this.instance.set(key, value, 'EX', ttlSeconds, 'NX');
            return result === 'OK';
        }
        const existing = await this.get(key);
        if (existing !== null)
            return false;
        await this.set(key, value, ttlSeconds);
        return true;
    }
    static async del(key) {
        if (this.instance && this.isConnected) {
            await this.instance.del(key);
            return;
        }
        inMemoryCache.delete(key);
    }
    static async delPattern(pattern) {
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
exports.RedisClient = RedisClient;
//# sourceMappingURL=redis-client.js.map