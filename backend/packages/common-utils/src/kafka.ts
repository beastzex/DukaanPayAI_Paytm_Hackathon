import { Kafka, Producer, Consumer, EachMessagePayload, logLevel } from 'kafkajs';
import { EventEmitter } from 'events';
import { BaseKafkaEvent } from '@dukaanpay/shared-types';
import { createServiceLogger } from './logger';

const logger = createServiceLogger('kafka-client');

// Global in-memory event bus shared across all local services when Kafka is not running
const globalEventBus = new EventEmitter();
globalEventBus.setMaxListeners(100);

export class KafkaEventBus {
  private kafka: Kafka | null = null;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private serviceName: string;
  private isKafkaActive = false;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

    if (process.env.USE_EMBEDDED_BUS !== 'true') {
      try {
        this.kafka = new Kafka({
          clientId: `dukaanpay-${serviceName}`,
          brokers,
          logLevel: logLevel.ERROR,
          retry: {
            initialRetryTime: 300,
            retries: 2,
          },
        });
      } catch (e) {
        this.kafka = null;
      }
    }
  }

  public async getProducer(): Promise<Producer | null> {
    if (!this.kafka) return null;
    if (!this.producer) {
      try {
        this.producer = this.kafka.producer({
          allowAutoTopicCreation: true,
          transactionTimeout: 5000,
        });
        await this.producer.connect();
        this.isKafkaActive = true;
        logger.info(`Kafka Producer connected for ${this.serviceName}`);
      } catch (err: any) {
        this.producer = null;
        this.isKafkaActive = false;
        logger.debug(`Kafka cluster not reachable, using embedded event bus for ${this.serviceName}`);
      }
    }
    return this.producer;
  }

  public async publishEvent<T>(
    topic: string,
    key: string,
    payload: T,
    correlationId = 'system'
  ): Promise<void> {
    const event: BaseKafkaEvent<T> = {
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
        } catch (error: any) {
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

  public async startConsumer(
    groupId: string,
    topics: string[],
    handler: (event: BaseKafkaEvent<any>, raw: any) => Promise<void>
  ): Promise<void> {
    // Register on in-memory bus for local zero-dependency testing
    for (const topic of topics) {
      globalEventBus.on(topic, async (event: BaseKafkaEvent<any>) => {
        try {
          await handler(event, { topic, partition: 0, message: { offset: '0' } });
        } catch (err: any) {
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
          eachMessage: async (payload: EachMessagePayload) => {
            const rawValue = payload.message.value?.toString();
            if (!rawValue) return;
            try {
              const parsedEvent = JSON.parse(rawValue);
              await handler(parsedEvent, payload);
            } catch (error: any) {
              logger.error(`Error processing Kafka message on ${payload.topic}`, { error: error.message });
            }
          },
        });
        logger.info(`Kafka consumer running for group: ${groupId}`);
      } catch (err: any) {
        logger.debug(`Kafka cluster not reachable for consumer group ${groupId}, using embedded event bus.`);
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect().catch(() => {});
      this.producer = null;
    }
    if (this.consumer) {
      await this.consumer.disconnect().catch(() => {});
      this.consumer = null;
    }
  }
}
