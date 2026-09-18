import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
/**
 * Robust, Production-Ready Database Service
 * Connects to PostgreSQL when available, and provides seamless in-memory fallback
 * with realistic pre-seeded Kirana data (Rameshji, Gupta Kirana Store, Kanpur)
 * for instant zero-dependency local development and real API interactions.
 */
export declare class DatabaseService {
    private static pool;
    private static isPgAvailable;
    private static memoryStore;
    static getPool(): Pool;
    static query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    static transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    private static executeInMemory;
    static close(): Promise<void>;
}
//# sourceMappingURL=db.d.ts.map