"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSentEvent = exports.CampaignStartedEvent = exports.MerchantUpdatedEvent = exports.MerchantCreatedEvent = void 0;
class MerchantCreatedEvent {
    eventId;
    aggregateId;
    payload;
    eventName = 'merchant.created';
    occurredOn = new Date().toISOString();
    constructor(eventId, aggregateId, payload) {
        this.eventId = eventId;
        this.aggregateId = aggregateId;
        this.payload = payload;
    }
}
exports.MerchantCreatedEvent = MerchantCreatedEvent;
class MerchantUpdatedEvent {
    eventId;
    aggregateId;
    payload;
    eventName = 'merchant.updated';
    occurredOn = new Date().toISOString();
    constructor(eventId, aggregateId, payload) {
        this.eventId = eventId;
        this.aggregateId = aggregateId;
        this.payload = payload;
    }
}
exports.MerchantUpdatedEvent = MerchantUpdatedEvent;
class CampaignStartedEvent {
    eventId;
    aggregateId;
    payload;
    eventName = 'campaign.started';
    occurredOn = new Date().toISOString();
    constructor(eventId, aggregateId, payload) {
        this.eventId = eventId;
        this.aggregateId = aggregateId;
        this.payload = payload;
    }
}
exports.CampaignStartedEvent = CampaignStartedEvent;
class NotificationSentEvent {
    eventId;
    aggregateId;
    payload;
    eventName = 'notification.sent';
    occurredOn = new Date().toISOString();
    constructor(eventId, aggregateId, payload) {
        this.eventId = eventId;
        this.aggregateId = aggregateId;
        this.payload = payload;
    }
}
exports.NotificationSentEvent = NotificationSentEvent;
//# sourceMappingURL=domain-events.js.map