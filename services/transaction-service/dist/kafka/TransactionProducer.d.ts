import { Transaction } from '@dukaanpay/shared-types';
export declare class TransactionProducer {
    private eventBus;
    constructor();
    publishTransactionReceived(txn: Transaction, correlationId?: string): Promise<void>;
}
//# sourceMappingURL=TransactionProducer.d.ts.map