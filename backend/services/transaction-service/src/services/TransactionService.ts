import { TransactionRepository, RevenueVelocity } from '../repositories/TransactionRepository';
import { TransactionProducer } from '../kafka/TransactionProducer';
import { IngestTransactionInput } from '@dukaanpay/shared-validators';
import { Transaction, LostRevenueMetrics, MarketBenchmarkData } from '@dukaanpay/shared-types';
import { ConflictError } from '@dukaanpay/common-utils';

export class TransactionService {
  private repository: TransactionRepository;
  private producer: TransactionProducer;

  constructor() {
    this.repository = new TransactionRepository();
    this.producer = new TransactionProducer();
  }

  public async ingestTransaction(
    input: IngestTransactionInput,
    correlationId = 'txn-ingest'
  ): Promise<Transaction> {
    // Check for duplicate transaction reference ID
    const existing = await this.repository.findByReferenceId(input.txnReferenceId);
    if (existing) {
      throw new ConflictError(`Transaction with reference ${input.txnReferenceId} already ingested`);
    }

    const txn = await this.repository.insertTransaction({
      merchantId: input.merchantId,
      storeId: input.storeId,
      soundboxDeviceId: input.soundboxDeviceId,
      txnReferenceId: input.txnReferenceId,
      payerVpaMasked: input.payerVpaMasked,
      amount: input.amount,
      paymentMode: input.paymentMode,
      capturedAt: new Date(input.capturedAt),
    });

    // Real-time Kafka notification
    await this.producer.publishTransactionReceived(txn, correlationId);

    return txn;
  }

  public async getVelocityAnalytics(merchantId: string, days = 7): Promise<RevenueVelocity> {
    return this.repository.getRevenueVelocity(merchantId, days);
  }

  public async getHourlyFootfallPattern(
    merchantId: string,
    days = 30
  ): Promise<Array<{ hourOfDay: number; txnCount: number; revenue: number }>> {
    return this.repository.getHourlyDistribution(merchantId, days);
  }

  public async getHistory(merchantId: string, limit = 50): Promise<Transaction[]> {
    return this.repository.getRecentTransactions(merchantId, limit);
  }

  public async getLostRevenue(merchantId: string): Promise<LostRevenueMetrics> {
    return this.repository.getLostRevenueAnalysis(merchantId);
  }

  public async getMarketBenchmark(merchantId: string): Promise<MarketBenchmarkData> {
    return this.repository.getMarketBenchmark(merchantId);
  }
}
