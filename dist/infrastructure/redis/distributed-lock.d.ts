export declare class DistributedLock {
    /**
     * Acquires a distributed lock using Redis atomic SET NX EX.
     * Prevents race conditions, duplicate campaign execution, and double WhatsApp sends.
     */
    static acquireLock(resource: string, ttlSeconds?: number): Promise<string | null>;
    /**
     * Releases the distributed lock only if the identifier matches (avoids releasing another worker's lock).
     */
    static releaseLock(resource: string, lockIdentifier: string): Promise<boolean>;
    /**
     * Helper to execute an async critical section within a distributed lock.
     */
    static withLock<T>(resource: string, action: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
//# sourceMappingURL=distributed-lock.d.ts.map