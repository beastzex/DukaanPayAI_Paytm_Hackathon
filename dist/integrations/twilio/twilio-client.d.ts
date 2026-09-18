export interface SendWhatsAppMessageOptions {
    recipient: string;
    messageText: string;
    mediaUrl?: string[];
    statusCallbackUrl?: string;
}
export interface InitiateVoiceCallOptions {
    recipient: string;
    twimlScript?: string;
    statusCallbackUrl?: string;
}
export interface TwilioDeliveryResult {
    providerMessageId: string;
    status: string;
    direction: 'outbound-api' | 'inbound';
    price?: string;
    errorCode?: string;
}
export declare class TwilioClient {
    private static client;
    static initialize(): void;
    /**
     * Sends an outbound WhatsApp message via Twilio WhatsApp API.
     */
    static sendWhatsAppMessage(options: SendWhatsAppMessageOptions): Promise<TwilioDeliveryResult>;
    /**
     * Initiates an outbound voice call via Twilio Voice API with Indic TwiML audio script.
     */
    static initiateVoiceCall(options: InitiateVoiceCallOptions): Promise<TwilioDeliveryResult>;
    /**
     * Generates dynamic TwiML XML string for Indian Kirana audio interactions.
     */
    static generateDefaultVoiceTwiML(merchantName?: string, messageText?: string): string;
}
//# sourceMappingURL=twilio-client.d.ts.map