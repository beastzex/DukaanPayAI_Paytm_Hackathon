"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const TransactionProducer_1 = require("../kafka/TransactionProducer");
const common_utils_1 = require("@dukaanpay/common-utils");
class TransactionService {
    repository;
    producer;
    constructor() {
        this.repository = new TransactionRepository_1.TransactionRepository();
        this.producer = new TransactionProducer_1.TransactionProducer();
    }
    async ingestTransaction(input, correlationId = 'txn-ingest') {
        // Check for duplicate transaction reference ID
        const existing = await this.repository.findByReferenceId(input.txnReferenceId);
        if (existing) {
            throw new common_utils_1.ConflictError(`Transaction with reference ${input.txnReferenceId} already ingested`);
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
    async getVelocityAnalytics(merchantId, days = 7) {
        return this.repository.getRevenueVelocity(merchantId, days);
    }
    async getHourlyFootfallPattern(merchantId, days = 30) {
        return this.repository.getHourlyDistribution(merchantId, days);
    }
    async getHistory(merchantId, limit = 50) {
        return this.repository.getRecentTransactions(merchantId, limit);
    }
    async getLostRevenue(merchantId) {
        return this.repository.getLostRevenueAnalysis(merchantId);
    }
    async getMarketBenchmark(merchantId) {
        return this.repository.getMarketBenchmark(merchantId);
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=TransactionService.js.map