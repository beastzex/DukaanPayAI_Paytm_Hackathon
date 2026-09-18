"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaEventBus = void 0;
const kafkajs_1 = require("kafkajs");
const events_1 = require("events");
const logger_1 = require("./logger");
const logger = (0, logger_1.createServiceLogger)('kafka-client');
// Global in-memory event bus shared across all local services when Kafka is not running
const globalEventBus = new events_1.EventEmitter();
globalEventBus.setMaxListeners(100);
class KafkaEventBus {
    kafka = null;
    producer = null;
    consumer = null;
    serviceName;
    isKafkaActive = false;
    constructor(serviceName) {
        this.serviceName = serviceName;
        const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
        if (process.env.USE_EMBEDDED_BUS !== 'true') {
            try {
                this.kafka = new kafkajs_1.Kafka({
                    clientId: `dukaanpay-${serviceName}`,
                    brokers,
                    logLevel: kafkajs_1.logLevel.ERROR,
                    retry: {
                        initialRetryTime: 300,
                        retries: 2,
                    },
                });
            }
            catch (e) {
                this.kafka = null;
            }
        }
    }
    async getProducer() {
        if (!this.kafka)
            return null;
        if (!this.producer) {
            try {
                this.producer = this.kafka.producer({
                    allowAutoTopicCreation: true,
                    transactionTimeout: 5000,
                });
                await this.producer.connect();
                this.isKafkaActive = true;
                logger.info(`Kafka Producer connected for ${this.serviceName}`);
            }
            catch (err) {
                this.producer = null;
                this.isKafkaActive = false;
                logger.debug(`Kafka cluster not reachable, using embedded event bus for ${this.serviceName}`);
            }
        }
        return this.producer;
    }
    async publishEvent(topic, key, payload, correlationId = 'system') {
        const event = {
            eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            eventType: topic,
            timestamp: new Date().toISOString(),
            sourceService: this.serviceName,
            correlationId,
            payload,
        };
        // Attempt real Kafka cluster if available
        if (this.kafka && process.env.USE_EMBEDDED_BUS !== 'true') {
            const producer = await this.getProducer();
            if (producer && this.isKafkaActive) {
                try {
                    await producer.send({
                        topic,
                        messages: [
                            {
                                key,
                                value: JSON.stringify(event),
                                headers: { correlationId, source: this.serviceName },
                            },
                        ],
                    });
                    logger.info(`Published event to Kafka topic [${topic}]`, { eventId: event.eventId, key });
                    return;
                }
                catch (error) {
                    logger.debug(`Failed to publish via Kafka, falling back to embedded bus`, { error: error.message });
                }
            }
        }
        // High-performance embedded event bus dispatch
        logger.info(`[Event Bus] Dispatched event to [${topic}]`, {
            eventId: event.eventId,
            key,
            source: this.serviceName,
        });
        setImmediate(() => {
            globalEventBus.emit(topic, event);
        });
    }
    async startConsumer(groupId, topics, handler) {
        // Register on in-memory bus for local zero-dependency testing
        for (const topic of topics) {
            globalEventBus.on(topic, async (event) => {
                try {
                    await handler(event, { topic, partition: 0, message: { offset: '0' } });
                }
                catch (err) {
                    logger.error(`Error processing message from embedded event bus on [${topic}]`, { error: err.message });
                }
            });
            logger.info(`Subscribed to event topic: [${topic}]`);
        }
        // Also attempt real Kafka connection if configured
        if (this.kafka && process.env.USE_EMBEDDED_BUS !== 'true') {
            try {
                this.consumer = this.kafka.consumer({ groupId });
                await this.consumer.connect();
                for (const topic of topics) {
                    await this.consumer.subscribe({ topic, fromBeginning: false });
                }
                await this.consumer.run({
                    eachMessage: async (payload) => {
                        const rawValue = payload.message.value?.toString();
                        if (!rawValue)
                            return;
                        try {
                            const parsedEvent = JSON.parse(rawValue);
                            await handler(parsedEvent, payload);
                        }
                        catch (error) {
                            logger.error(`Error processing Kafka message on ${payload.topic}`, { error: error.message });
                        }
                    },
                });
                logger.info(`Kafka consumer running for group: ${groupId}`);
            }
            catch (err) {
                logger.debug(`Kafka cluster not reachable for consumer group ${groupId}, using embedded event bus.`);
            }
        }
    }
    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect().catch(() => { });
            this.producer = null;
        }
        if (this.consumer) {
            await this.consumer.disconnect().catch(() => { });
            this.consumer = null;
        }
    }
}
exports.KafkaEventBus = KafkaEventBus;
//# sourceMappingURL=kafka.js.map