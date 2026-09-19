import { RedisClient } from './redis-client';
import { logger } from '../../monitoring/logger';
import crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

export class DistributedLock {
  /**
   * Acquires a distributed lock using Redis atomic SET NX EX.
   * Prevents race conditions, duplicate campaign execution, and double WhatsApp sends.
   */
  public static async acquireLock(
    resource: string,
    ttlSeconds = 30
  ): Promise<string | null> {
    const lockKey = `lock:${resource}`;
    const lockIdentifier = uuidv4();

    const acquired = await RedisClient.setnx(lockKey, lockIdentifier, ttlSeconds);

    if (acquired) {
      logger.info({ resource, lockKey }, 'Distributed lock acquired');
      return lockIdentifier;
    }

    logger.warn({ resource, lockKey }, 'Failed to acquire distributed lock: already held');
    return null;
  }

  /**
   * Releases the distributed lock only if the identifier matches (avoids releasing another worker's lock).
   */
  public static async releaseLock(resource: string, lockIdentifier: string): Promise<boolean> {
    const lockKey = `lock:${resource}`;
    const currentValue = await RedisClient.get(lockKey);

    if (currentValue === lockIdentifier) {
      await RedisClient.del(lockKey);
      logger.info({ resource, lockKey }, 'Distributed lock released cleanly');
      return true;
    }

    logger.warn({ resource, lockKey }, 'Cannot release lock: expired or held by different worker');
    return false;
  }

  /**
   * Helper to execute an async critical section within a distributed lock.
   */
  public static async withLock<T>(
    resource: string,
    action: () => Promise<T>,
    ttlSeconds = 30
  ): Promise<T> {
    const lockId = await this.acquireLock(resource, ttlSeconds);
    if (!lockId) {
      throw new Error(`Concurrent execution blocked: Resource [${resource}] is currently locked.`);
    }

    try {
      return await action();
    } finally {
      await this.releaseLock(resource, lockId);
    }
  }
}
