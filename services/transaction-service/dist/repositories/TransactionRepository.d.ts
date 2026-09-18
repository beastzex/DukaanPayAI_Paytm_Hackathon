import { Transaction, PaymentMode, LostRevenueMetrics, MarketBenchmarkData } from '@dukaanpay/shared-types';
export interface IngestTransactionParams {
    merchantId: string;
    storeId: string;
    soundboxDeviceId?: string;
    txnReferenceId: string;
    payerVpaMasked?: string;
    amount: number;
    paymentMode: PaymentMode;
    capturedAt: Date;
}
export interface RevenueVelocity {
    totalRevenue: number;
    transactionCount: number;
    averageOrderValue: number;
    minTransaction: number;
    maxTransaction: number;
}
export declare class TransactionRepository {
    findByReferenceId(referenceId: string): Promise<Transaction | null>;
    insertTransaction(params: IngestTransactionParams): Promise<Transaction>;
    getRevenueVelocity(merchantId: string, days?: number): Promise<RevenueVelocity>;
    getHourlyDistribution(merchantId: string, days?: number): Promise<Array<{
        hourOfDay: number;
        txnCount: number;
        revenue: number;
    }>>;
    getRecentTransactions(merchantId: string, limit?: number): Promise<Transaction[]>;
    getLostRevenueAnalysis(merchantId: string): Promise<LostRevenueMetrics>;
    getMarketBenchmark(merchantId: string): Promise<MarketBenchmarkData>;
}
//# sourceMappingURL=TransactionRepository.d.ts.map