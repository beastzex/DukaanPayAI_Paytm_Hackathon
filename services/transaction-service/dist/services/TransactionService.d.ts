import { RevenueVelocity } from '../repositories/TransactionRepository';
import { IngestTransactionInput } from '@dukaanpay/shared-validators';
import { Transaction, LostRevenueMetrics, MarketBenchmarkData } from '@dukaanpay/shared-types';
export declare class TransactionService {
    private repository;
    private producer;
    constructor();
    ingestTransaction(input: IngestTransactionInput, correlationId?: string): Promise<Transaction>;
    getVelocityAnalytics(merchantId: string, days?: number): Promise<RevenueVelocity>;
    getHourlyFootfallPattern(merchantId: string, days?: number): Promise<Array<{
        hourOfDay: number;
        txnCount: number;
        revenue: number;
    }>>;
    getHistory(merchantId: string, limit?: number): Promise<Transaction[]>;
    getLostRevenue(merchantId: string): Promise<LostRevenueMetrics>;
    getMarketBenchmark(merchantId: string): Promise<MarketBenchmarkData>;
}
//# sourceMappingURL=TransactionService.d.ts.map