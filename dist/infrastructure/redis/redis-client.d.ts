import Redis from 'ioredis';
export declare class RedisClient {
    private static instance;
    private static isConnected;
    static initialize(): Redis | null;
    static getInstance(): Redis | null;
    static get(key: string): Promise<string | null>;
    static set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    static setnx(key: string, value: string, ttlSeconds: number): Promise<boolean>;
    static del(key: string): Promise<void>;
    static delPattern(pattern: string): Promise<void>;
}
//# sourceMappingURL=redis-client.d.ts.map