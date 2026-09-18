export declare const KAFKA_TOPICS: {
    readonly MERCHANT_CREATED: "merchant.created";
    readonly MERCHANT_UPDATED: "merchant.updated";
    readonly MERCHANT_DELETED: "merchant.deleted";
    readonly CAMPAIGN_CREATED: "campaign.created";
    readonly CAMPAIGN_STARTED: "campaign.started";
    readonly CAMPAIGN_COMPLETED: "campaign.completed";
    readonly NOTIFICATION_SEND: "notification.send";
    readonly NOTIFICATION_SENT: "notification.sent";
    readonly WHATSAPP_MESSAGE_RECEIVED: "whatsapp.message.received";
    readonly WHATSAPP_MESSAGE_SENT: "whatsapp.message.sent";
    readonly VOICE_CALL_STARTED: "voice.call.started";
    readonly VOICE_CALL_COMPLETED: "voice.call.completed";
    readonly AUDIT_EVENT: "audit.event";
    readonly DLQ_EVENT: "dead.letter.queue";
};
export type KafkaTopic = typeof KAFKA_TOPICS[keyof typeof KAFKA_TOPICS];
export interface CloudEventEnvelope<T = any> {
    specversion: '1.0';
    id: string;
    type: KafkaTopic;
    source: string;
    time: string;
    datacontenttype: 'application/json';
    data: T;
    partitionKey: string;
}
export declare class KafkaEventBus {
    private static kafka;
    private static producer;
    private static consumer;
    private static isConnected;
    static initialize(): Promise<void>;
    static publish<T>(topic: KafkaTopic, partitionKey: string, data: T, source?: string): Promise<CloudEventEnvelope<T>>;
    static subscribe(topic: KafkaTopic, handler: (event: CloudEventEnvelope) => Promise<void>): Promise<void>;
    static routeToDLQ(originalTopic: string, event: CloudEventEnvelope, reason: string): Promise<void>;
    static disconnect(): Promise<void>;
}
//# sourceMappingURL=kafka-client.d.ts.map