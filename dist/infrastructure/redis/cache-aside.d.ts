export declare class CacheAside {
    /**
     * Retrieves an item from Redis cache or fetches from primary DB and warms the cache.
     */
    static getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds?: number, namespace?: string): Promise<T>;
    static invalidate(key: string): Promise<void>;
    static invalidatePattern(pattern: string): Promise<void>;
}
//# sourceMappingURL=cache-aside.d.ts.map