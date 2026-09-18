import { PostgresNotificationRepository } from '../repositories/postgres/postgres-repositories';
import { NotificationChannel, NotificationStatus, NotificationEntity } from '../domain/entities/entities';
import { QueueManager, QUEUE_NAMES } from '../workers/queue-manager';
import { TwilioClient } from '../integrations/twilio/twilio-client';
import { KafkaEventBus, KAFKA_TOPICS } from '../events/kafka-client';
import { DistributedLock } from '../infrastructure/redis/distributed-lock';
import { logger } from '../monitoring/logger';

export interface SendMessageDto {
  merchantId: string;
  recipient: string;
  content: string;
  channel?: NotificationChannel;
  campaignId?: string;
  priority?: number;
}

export interface InitiateCallDto {
  merchantId: string;
  recipient: string;
  twimlScript?: string;
  merchantName?: string;
}

export class CommunicationService {
  private notificationRepo = new PostgresNotificationRepository();

  /**
   * Enqueues an outbound WhatsApp notification through BullMQ and Redlock to prevent duplicate sends.
   */
  public async sendWhatsAppMessage(dto: SendMessageDto): Promise<{ notificationId: string; status: string; queued: boolean }> {
    const lockResource = `whatsapp:${dto.merchantId}:${dto.recipient}:${Buffer.from(dto.content).toString('base64').substring(0, 16)}`;

    return DistributedLock.withLock(
      lockResource,
      async () => {
        // 1. Persist notification record
        const notification = await this.notificationRepo.create({
          merchantId: dto.merchantId,
          campaignId: dto.campaignId,
          channel: NotificationChannel.WHATSAPP,
          recipient: dto.recipient,
          content: dto.content,
          status: NotificationStatus.QUEUED,
          retryCount: 0,
        });

        // 2. Publish Kafka Event
        await KafkaEventBus.publish(
          KAFKA_TOPICS.NOTIFICATION_SEND,
          dto.merchantId,
          {
            notificationId: notification.id,
            channel: 'WHATSAPP',
            recipient: dto.recipient,
          }
        );

        // 3. Offload to BullMQ worker queue for rate-limited async execution
        await QueueManager.enqueue(
          QUEUE_NAMES.WHATSAPP,
          'dispatch_whatsapp_message',
          {
            notificationId: notification.id,
            recipient: dto.recipient,
            content: dto.content,
          },
          { priority: dto.priority || 5 }
        );

        // 4. Perform direct dispatch if sandbox or real provider initialized
        const result = await TwilioClient.sendWhatsAppMessage({
          recipient: dto.recipient,
          messageText: dto.content,
        });

        await this.notificationRepo.updateStatus(notification.id, NotificationStatus.SENT, result.providerMessageId);

        await KafkaEventBus.publish(
          KAFKA_TOPICS.WHATSAPP_MESSAGE_SENT,
          dto.merchantId,
          {
            notificationId: notification.id,
            sid: result.providerMessageId,
            recipient: dto.recipient,
          }
        );

        logger.info({ notificationId: notification.id }, 'WhatsApp message queued & dispatched successfully');

        return {
          notificationId: notification.id,
          status: 'SENT',
          queued: true,
        };
      },
      15 // 15-second distributed lock
    );
  }

  /**
   * Initiates an outbound voice call with Twilio and TwiML scripts.
   */
  public async initiateVoiceCall(dto: InitiateCallDto): Promise<{ callId: string; status: string }> {
    const notification = await this.notificationRepo.create({
      merchantId: dto.merchantId,
      channel: NotificationChannel.VOICE,
      recipient: dto.recipient,
      content: 'Outbound Voice Briefing Call',
      status: NotificationStatus.SENDING,
      retryCount: 0,
    });

    const twiml = dto.twimlScript || TwilioClient.generateDefaultVoiceTwiML(dto.merchantName);

    // Enqueue to voice call BullMQ queue
    await QueueManager.enqueue(
      QUEUE_NAMES.VOICE_CALL,
      'initiate_voice_call',
      {
        notificationId: notification.id,
        recipient: dto.recipient,
      }
    );

    const callResult = await TwilioClient.initiateVoiceCall({
      recipient: dto.recipient,
      twimlScript: twiml,
    });

    await this.notificationRepo.updateStatus(notification.id, NotificationStatus.SENT, callResult.providerMessageId);

    await KafkaEventBus.publish(
      KAFKA_TOPICS.VOICE_CALL_STARTED,
      dto.merchantId,
      {
        notificationId: notification.id,
        callSid: callResult.providerMessageId,
        recipient: dto.recipient,
      }
    );

    return {
      callId: notification.id,
      status: callResult.status,
    };
  }
}
