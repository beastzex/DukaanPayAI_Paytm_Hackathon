import { PoolClient, QueryResult, QueryResultRow } from 'pg';
export declare class PostgresClient {
    private static primaryPool;
    private static readReplicaPool;
    static initialize(): void;
    static query<T extends QueryResultRow = any>(sqlText: string, params?: any[], useReadReplica?: boolean): Promise<QueryResult<T>>;
    static withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    private static executeInMemoryQuery;
    static close(): Promise<void>;
}
//# sourceMappingURL=postgres-client.d.ts.map