export interface DomainEvent<T = any> {
    eventId: string;
    eventName: string;
    occurredOn: string;
    aggregateId: string;
    payload: T;
}
export declare class MerchantCreatedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        merchantId: string;
        businessName: string;
        phoneNumber: string;
        city: string;
    };
    readonly eventName = "merchant.created";
    readonly occurredOn: string;
    constructor(eventId: string, aggregateId: string, payload: {
        merchantId: string;
        businessName: string;
        phoneNumber: string;
        city: string;
    });
}
export declare class MerchantUpdatedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        merchantId: string;
        fieldsUpdated: string[];
    };
    readonly eventName = "merchant.updated";
    readonly occurredOn: string;
    constructor(eventId: string, aggregateId: string, payload: {
        merchantId: string;
        fieldsUpdated: string[];
    });
}
export declare class CampaignStartedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        campaignId: string;
        merchantId: string;
        targetAudienceCount: number;
        channel: string;
    };
    readonly eventName = "campaign.started";
    readonly occurredOn: string;
    constructor(eventId: string, aggregateId: string, payload: {
        campaignId: string;
        merchantId: string;
        targetAudienceCount: number;
        channel: string;
    });
}
export declare class NotificationSentEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        notificationId: string;
        recipient: string;
        channel: string;
        providerRef: string;
    };
    readonly eventName = "notification.sent";
    readonly occurredOn: string;
    constructor(eventId: string, aggregateId: string, payload: {
        notificationId: string;
        recipient: string;
        channel: string;
        providerRef: string;
    });
}
//# sourceMappingURL=domain-events.d.ts.map