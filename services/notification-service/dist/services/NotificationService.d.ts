export declare class NotificationService {
    private repo;
    private eventBus;
    constructor();
    sendWhatsAppMessage(merchantId: string, phoneNumber: string, templateName: string, bodyText: string, correlationId?: string): Promise<string>;
    triggerTwilioVoiceCall(merchantId: string, phoneNumber: string, speechScriptHindi: string): Promise<string>;
    startConsumers(): Promise<void>;
}
//# sourceMappingURL=NotificationService.d.ts.map