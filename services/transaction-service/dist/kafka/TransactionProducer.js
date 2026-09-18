"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionProducer = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const logger = (0, common_utils_1.createServiceLogger)('transaction-kafka-producer');
class TransactionProducer {
    eventBus;
    constructor() {
        this.eventBus = new common_utils_1.KafkaEventBus('transaction-service');
    }
    async publishTransactionReceived(txn, correlationId = 'txn-stream') {
        const payload = {
            transactionId: txn.id,
            merchantId: txn.merchantId,
            storeId: txn.storeId,
            amount: Number(txn.amount),
            soundboxDeviceId: txn.soundboxDeviceId,
            paymentMode: txn.paymentMode,
            capturedAt: txn.capturedAt instanceof Date ? txn.capturedAt.toISOString() : String(txn.capturedAt),
        };
        try {
            await this.eventBus.publishEvent('transaction.received', txn.merchantId, payload, correlationId);
            logger.info('Published transaction.received event', {
                txnId: txn.id,
                amount: txn.amount,
                merchantId: txn.merchantId,
            });
        }
        catch (err) {
            logger.error('Failed to publish transaction.received event', { error: err.message });
        }
    }
}
exports.TransactionProducer = TransactionProducer;
//# sourceMappingURL=TransactionProducer.js.map