import { KafkaEventBus, createServiceLogger } from '@dukaanpay/common-utils';
import { TransactionReceivedPayload, Transaction } from '@dukaanpay/shared-types';

const logger = createServiceLogger('transaction-kafka-producer');

export class TransactionProducer {
  private eventBus: KafkaEventBus;

  constructor() {
    this.eventBus = new KafkaEventBus('transaction-service');
  }

  public async publishTransactionReceived(
    txn: Transaction,
    correlationId = 'txn-stream'
  ): Promise<void> {
    const payload: TransactionReceivedPayload = {
      transactionId: txn.id,
      merchantId: txn.merchantId,
      storeId: txn.storeId,
      amount: Number(txn.amount),
      soundboxDeviceId: txn.soundboxDeviceId,
      paymentMode: txn.paymentMode,
      capturedAt: txn.capturedAt instanceof Date ? txn.capturedAt.toISOString() : String(txn.capturedAt),
    };

    try {
      await this.eventBus.publishEvent(
        'transaction.received',
        txn.merchantId,
        payload,
        correlationId
      );
      logger.info('Published transaction.received event', {
        txnId: txn.id,
        amount: txn.amount,
        merchantId: txn.merchantId,
      });
    } catch (err: any) {
      logger.error('Failed to publish transaction.received event', { error: err.message });
    }
  }
}
