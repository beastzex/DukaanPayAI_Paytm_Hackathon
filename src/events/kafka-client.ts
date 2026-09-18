import { Kafka, Producer, Consumer } from 'kafkajs';
import { config } from '../configs/env.config';
import { logger } from '../monitoring/logger';
import { kafkaEventsPublishedTotal, kafkaEventsConsumedTotal } from '../monitoring/metrics';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export const KAFKA_TOPICS = {
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
} as const;

export type KafkaTopic = typeof KAFKA_TOPICS[keyof typeof KAFKA_TOPICS];

export interface CloudEventEnvelope<T = any> {
  specversion: '1.0';
  id: string; // UUID
  type: KafkaTopic;
  source: string;
  time: string;
  datacontenttype: 'application/json';
  data: T;
  partitionKey: string;
}

// Embedded local event bus fallback
const localBus = new EventEmitter();
localBus.setMaxListeners(100);

export class KafkaEventBus {
  private static kafka: Kafka | null = null;
  private static producer: Producer | null = null;
  private static consumer: Consumer | null = null;
  private static isConnected = false;

  public static async initialize(): Promise<void> {
    if (config.USE_EMBEDDED_BUS) {
      logger.info('Kafka Event Bus running in high-performance embedded event bus mode');
      return;
    }

    try {
      this.kafka = new Kafka({
        clientId: config.KAFKA_CLIENT_ID,
        brokers: config.KAFKA_BROKERS.split(','),
        retry: {
          initialRetryTime: 300,
          retries: 5,
        },
      });

      this.producer = this.kafka.producer({ idempotent: true });
      await this.producer.connect();

      this.consumer = this.kafka.consumer({ groupId: config.KAFKA_GROUP_ID });
      await this.consumer.connect();

      this.isConnected = true;
      logger.info('Connected to Apache Kafka broker cluster successfully');
    } catch (error) {
      logger.warn({ error }, 'Failed to connect to Kafka brokers, falling back to embedded event bus');
      this.isConnected = false;
    }
  }

  public static async publish<T>(
    topic: KafkaTopic,
    partitionKey: string,
    data: T,
    source = 'dukaanpay-core-backend'
  ): Promise<CloudEventEnvelope<T>> {
    const event: CloudEventEnvelope<T> = {
      specversion: '1.0',
      id: uuidv4(),
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
        kafkaEventsPublishedTotal.inc({ topic });
        logger.info({ topic, eventId: event.id, partitionKey }, 'Kafka event published');
        return event;
      } catch (err) {
        logger.error({ topic, error: err }, 'Failed to publish to Kafka, routing to DLQ');
        await this.routeToDLQ(topic, event, (err as Error).message);
        throw err;
      }
    }

    // Embedded in-memory bus execution
    localBus.emit(topic, event);
    kafkaEventsPublishedTotal.inc({ topic });
    logger.debug({ topic, eventId: event.id, partitionKey }, 'Embedded bus event dispatched');
    return event;
  }

  public static async subscribe(
    topic: KafkaTopic,
    handler: (event: CloudEventEnvelope) => Promise<void>
  ): Promise<void> {
    if (this.consumer && this.isConnected) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;
          try {
            const event = JSON.parse(message.value.toString()) as CloudEventEnvelope;
            await handler(event);
            kafkaEventsConsumedTotal.inc({ topic, status: 'success' });
          } catch (err) {
            kafkaEventsConsumedTotal.inc({ topic, status: 'failed' });
            logger.error({ topic, error: err }, 'Consumer processing error');
          }
        },
      });
      return;
    }

    // Embedded in-memory listener
    localBus.on(topic, async (event: CloudEventEnvelope) => {
      try {
        await handler(event);
        kafkaEventsConsumedTotal.inc({ topic, status: 'success' });
      } catch (err) {
        kafkaEventsConsumedTotal.inc({ topic, status: 'failed' });
        logger.error({ topic, error: err }, 'Local consumer processing error');
      }
    });
  }

  public static async routeToDLQ(
    originalTopic: string,
    event: CloudEventEnvelope,
    reason: string
  ): Promise<void> {
    logger.warn({ originalTopic, eventId: event.id, reason }, 'Routing failed event to Dead Letter Queue');
    localBus.emit(KAFKA_TOPICS.DLQ_EVENT, { ...event, dlqReason: reason, originalTopic });
  }

  public static async disconnect(): Promise<void> {
    if (this.producer) await this.producer.disconnect();
    if (this.consumer) await this.consumer.disconnect();
  }
}
