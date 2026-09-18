"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaEventBus = exports.KAFKA_TOPICS = void 0;
const kafkajs_1 = require("kafkajs");
const env_config_1 = require("../configs/env.config");
const logger_1 = require("../monitoring/logger");
const metrics_1 = require("../monitoring/metrics");
const events_1 = require("events");
const uuid_1 = require("uuid");
exports.KAFKA_TOPICS = {
    MERCHANT_CREATED: 'merchant.created',
    MERCHANT_UPDATED: 'merchant.updated',
    MERCHANT_DELETED: 'merchant.deleted',
    CAMPAIGN_CREATED: 'campaign.created',
    CAMPAIGN_STARTED: 'campaign.started',
    CAMPAIGN_COMPLETED: 'campaign.completed',
    NOTIFICATION_SEND: 'notification.send',
    NOTIFICATION_SENT: 'notification.sent',
    WHATSAPP_MESSAGE_RECEIVED: 'whatsapp.message.received',
    WHATSAPP_MESSAGE_SENT: 'whatsapp.message.sent',
    VOICE_CALL_STARTED: 'voice.call.started',
    VOICE_CALL_COMPLETED: 'voice.call.completed',
    AUDIT_EVENT: 'audit.event',
    DLQ_EVENT: 'dead.letter.queue',
};
// Embedded local event bus fallback
const localBus = new events_1.EventEmitter();
localBus.setMaxListeners(100);
class KafkaEventBus {
    static kafka = null;
    static producer = null;
    static consumer = null;
    static isConnected = false;
    static async initialize() {
        if (env_config_1.config.USE_EMBEDDED_BUS) {
            logger_1.logger.info('Kafka Event Bus running in high-performance embedded event bus mode');
            return;
        }
        try {
            this.kafka = new kafkajs_1.Kafka({
                clientId: env_config_1.config.KAFKA_CLIENT_ID,
                brokers: env_config_1.config.KAFKA_BROKERS.split(','),
                retry: {
                    initialRetryTime: 300,
                    retries: 5,
                },
            });
            this.producer = this.kafka.producer({ idempotent: true });
            await this.producer.connect();
            this.consumer = this.kafka.consumer({ groupId: env_config_1.config.KAFKA_GROUP_ID });
            await this.consumer.connect();
            this.isConnected = true;
            logger_1.logger.info('Connected to Apache Kafka broker cluster successfully');
        }
        catch (error) {
            logger_1.logger.warn({ error }, 'Failed to connect to Kafka brokers, falling back to embedded event bus');
            this.isConnected = false;
        }
    }
    static async publish(topic, partitionKey, data, source = 'dukaanpay-core-backend') {
        const event = {
            specversion: '1.0',
            id: (0, uuid_1.v4)(),
            type: topic,
            source,
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data,
            partitionKey,
        };
        if (this.producer && this.isConnected) {
            try {
                await this.producer.send({
                    topic,
                    messages: [
                        {
                            key: partitionKey,
                            value: JSON.stringify(event),
                            headers: {
                                correlationId: event.id,
                                source: event.source,
                            },
                        },
                    ],
                });
                metrics_1.kafkaEventsPublishedTotal.inc({ topic });
                logger_1.logger.info({ topic, eventId: event.id, partitionKey }, 'Kafka event published');
                return event;
            }
            catch (err) {
                logger_1.logger.error({ topic, error: err }, 'Failed to publish to Kafka, routing to DLQ');
                await this.routeToDLQ(topic, event, err.message);
                throw err;
            }
        }
        // Embedded in-memory bus execution
        localBus.emit(topic, event);
        metrics_1.kafkaEventsPublishedTotal.inc({ topic });
        logger_1.logger.debug({ topic, eventId: event.id, partitionKey }, 'Embedded bus event dispatched');
        return event;
    }
    static async subscribe(topic, handler) {
        if (this.consumer && this.isConnected) {
            await this.consumer.subscribe({ topic, fromBeginning: false });
            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    if (!message.value)
                        return;
                    try {
                        const event = JSON.parse(message.value.toString());
                        await handler(event);
                        metrics_1.kafkaEventsConsumedTotal.inc({ topic, status: 'success' });
                    }
                    catch (err) {
                        metrics_1.kafkaEventsConsumedTotal.inc({ topic, status: 'failed' });
                        logger_1.logger.error({ topic, error: err }, 'Consumer processing error');
                    }
                },
            });
            return;
        }
        // Embedded in-memory listener
        localBus.on(topic, async (event) => {
            try {
                await handler(event);
                metrics_1.kafkaEventsConsumedTotal.inc({ topic, status: 'success' });
            }
            catch (err) {
                metrics_1.kafkaEventsConsumedTotal.inc({ topic, status: 'failed' });
                logger_1.logger.error({ topic, error: err }, 'Local consumer processing error');
            }
        });
    }
    static async routeToDLQ(originalTopic, event, reason) {
        logger_1.logger.warn({ originalTopic, eventId: event.id, reason }, 'Routing failed event to Dead Letter Queue');
        localBus.emit(exports.KAFKA_TOPICS.DLQ_EVENT, { ...event, dlqReason: reason, originalTopic });
    }
    static async disconnect() {
        if (this.producer)
            await this.producer.disconnect();
        if (this.consumer)
            await this.consumer.disconnect();
    }
}
exports.KafkaEventBus = KafkaEventBus;
//# sourceMappingURL=kafka-client.js.map