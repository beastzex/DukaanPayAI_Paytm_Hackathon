import { NotificationChannel } from '../domain/entities/entities';
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
export declare class CommunicationService {
    private notificationRepo;
    /**
     * Enqueues an outbound WhatsApp notification through BullMQ and Redlock to prevent duplicate sends.
     */
    sendWhatsAppMessage(dto: SendMessageDto): Promise<{
        notificationId: string;
        status: string;
        queued: boolean;
    }>;
    /**
     * Initiates an outbound voice call with Twilio and TwiML scripts.
     */
    initiateVoiceCall(dto: InitiateCallDto): Promise<{
        callId: string;
        status: string;
    }>;
}
//# sourceMappingURL=communication.service.d.ts.map