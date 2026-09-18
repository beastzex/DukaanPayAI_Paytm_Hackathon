"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationService = void 0;
const postgres_repositories_1 = require("../repositories/postgres/postgres-repositories");
const entities_1 = require("../domain/entities/entities");
const queue_manager_1 = require("../workers/queue-manager");
const twilio_client_1 = require("../integrations/twilio/twilio-client");
const kafka_client_1 = require("../events/kafka-client");
const distributed_lock_1 = require("../infrastructure/redis/distributed-lock");
const logger_1 = require("../monitoring/logger");
class CommunicationService {
    notificationRepo = new postgres_repositories_1.PostgresNotificationRepository();
    /**
     * Enqueues an outbound WhatsApp notification through BullMQ and Redlock to prevent duplicate sends.
     */
    async sendWhatsAppMessage(dto) {
        const lockResource = `whatsapp:${dto.merchantId}:${dto.recipient}:${Buffer.from(dto.content).toString('base64').substring(0, 16)}`;
        return distributed_lock_1.DistributedLock.withLock(lockResource, async () => {
            // 1. Persist notification record
            const notification = await this.notificationRepo.create({
                merchantId: dto.merchantId,
                campaignId: dto.campaignId,
                channel: entities_1.NotificationChannel.WHATSAPP,
                recipient: dto.recipient,
                content: dto.content,
                status: entities_1.NotificationStatus.QUEUED,
                retryCount: 0,
            });
            // 2. Publish Kafka Event
            await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.NOTIFICATION_SEND, dto.merchantId, {
                notificationId: notification.id,
                channel: 'WHATSAPP',
                recipient: dto.recipient,
            });
            // 3. Offload to BullMQ worker queue for rate-limited async execution
            await queue_manager_1.QueueManager.enqueue(queue_manager_1.QUEUE_NAMES.WHATSAPP, 'dispatch_whatsapp_message', {
                notificationId: notification.id,
                recipient: dto.recipient,
                content: dto.content,
            }, { priority: dto.priority || 5 });
            // 4. Perform direct dispatch if sandbox or real provider initialized
            const result = await twilio_client_1.TwilioClient.sendWhatsAppMessage({
                recipient: dto.recipient,
                messageText: dto.content,
            });
            await this.notificationRepo.updateStatus(notification.id, entities_1.NotificationStatus.SENT, result.providerMessageId);
            await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.WHATSAPP_MESSAGE_SENT, dto.merchantId, {
                notificationId: notification.id,
                sid: result.providerMessageId,
                recipient: dto.recipient,
            });
            logger_1.logger.info({ notificationId: notification.id }, 'WhatsApp message queued & dispatched successfully');
            return {
                notificationId: notification.id,
                status: 'SENT',
                queued: true,
            };
        }, 15 // 15-second distributed lock
        );
    }
    /**
     * Initiates an outbound voice call with Twilio and TwiML scripts.
     */
    async initiateVoiceCall(dto) {
        const notification = await this.notificationRepo.create({
            merchantId: dto.merchantId,
            channel: entities_1.NotificationChannel.VOICE,
            recipient: dto.recipient,
            content: 'Outbound Voice Briefing Call',
            status: entities_1.NotificationStatus.SENDING,
            retryCount: 0,
        });
        const twiml = dto.twimlScript || twilio_client_1.TwilioClient.generateDefaultVoiceTwiML(dto.merchantName);
        // Enqueue to voice call BullMQ queue
        await queue_manager_1.QueueManager.enqueue(queue_manager_1.QUEUE_NAMES.VOICE_CALL, 'initiate_voice_call', {
            notificationId: notification.id,
            recipient: dto.recipient,
        });
        const callResult = await twilio_client_1.TwilioClient.initiateVoiceCall({
            recipient: dto.recipient,
            twimlScript: twiml,
        });
        await this.notificationRepo.updateStatus(notification.id, entities_1.NotificationStatus.SENT, callResult.providerMessageId);
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.VOICE_CALL_STARTED, dto.merchantId, {
            notificationId: notification.id,
            callSid: callResult.providerMessageId,
            recipient: dto.recipient,
        });
        return {
            callId: notification.id,
            status: callResult.status,
        };
    }
}
exports.CommunicationService = CommunicationService;
//# sourceMappingURL=communication.service.js.map