import { Producer } from 'kafkajs';
import { BaseKafkaEvent } from '@dukaanpay/shared-types';
export declare class KafkaEventBus {
    private kafka;
    private producer;
    private consumer;
    private serviceName;
    private isKafkaActive;
    constructor(serviceName: string);
    getProducer(): Promise<Producer | null>;
    publishEvent<T>(topic: string, key: string, payload: T, correlationId?: string): Promise<void>;
    startConsumer(groupId: string, topics: string[], handler: (event: BaseKafkaEvent<any>, raw: any) => Promise<void>): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=kafka.d.ts.map