"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedLock = void 0;
const redis_client_1 = require("./redis-client");
const logger_1 = require("../../monitoring/logger");
const uuid_1 = require("uuid");
class DistributedLock {
    /**
     * Acquires a distributed lock using Redis atomic SET NX EX.
     * Prevents race conditions, duplicate campaign execution, and double WhatsApp sends.
     */
    static async acquireLock(resource, ttlSeconds = 30) {
        const lockKey = `lock:${resource}`;
        const lockIdentifier = (0, uuid_1.v4)();
        const acquired = await redis_client_1.RedisClient.setnx(lockKey, lockIdentifier, ttlSeconds);
        if (acquired) {
            logger_1.logger.info({ resource, lockKey }, 'Distributed lock acquired');
            return lockIdentifier;
        }
        logger_1.logger.warn({ resource, lockKey }, 'Failed to acquire distributed lock: already held');
        return null;
    }
    /**
     * Releases the distributed lock only if the identifier matches (avoids releasing another worker's lock).
     */
    static async releaseLock(resource, lockIdentifier) {
        const lockKey = `lock:${resource}`;
        const currentValue = await redis_client_1.RedisClient.get(lockKey);
        if (currentValue === lockIdentifier) {
            await redis_client_1.RedisClient.del(lockKey);
            logger_1.logger.info({ resource, lockKey }, 'Distributed lock released cleanly');
            return true;
        }
        logger_1.logger.warn({ resource, lockKey }, 'Cannot release lock: expired or held by different worker');
        return false;
    }
    /**
     * Helper to execute an async critical section within a distributed lock.
     */
    static async withLock(resource, action, ttlSeconds = 30) {
        const lockId = await this.acquireLock(resource, ttlSeconds);
        if (!lockId) {
            throw new Error(`Concurrent execution blocked: Resource [${resource}] is currently locked.`);
        }
        try {
            return await action();
        }
        finally {
            await this.releaseLock(resource, lockId);
        }
    }
}
exports.DistributedLock = DistributedLock;
//# sourceMappingURL=distributed-lock.js.map