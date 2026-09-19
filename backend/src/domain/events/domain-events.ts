export interface DomainEvent<T = any> {
  eventId: string;
  eventName: string;
  occurredOn: string;
  aggregateId: string;
  payload: T;
}

export class MerchantCreatedEvent implements DomainEvent {
  public readonly eventName = 'merchant.created';
  public readonly occurredOn: string = new Date().toISOString();

  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: {
      merchantId: string;
      businessName: string;
      phoneNumber: string;
      city: string;
    }
  ) {}
}

export class MerchantUpdatedEvent implements DomainEvent {
  public readonly eventName = 'merchant.updated';
  public readonly occurredOn: string = new Date().toISOString();

  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: {
      merchantId: string;
      fieldsUpdated: string[];
    }
  ) {}
}

export class CampaignStartedEvent implements DomainEvent {
  public readonly eventName = 'campaign.started';
  public readonly occurredOn: string = new Date().toISOString();

  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: {
      campaignId: string;
      merchantId: string;
      targetAudienceCount: number;
      channel: string;
    }
  ) {}
}

export class NotificationSentEvent implements DomainEvent {
  public readonly eventName = 'notification.sent';
  public readonly occurredOn: string = new Date().toISOString();

  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: {
      notificationId: string;
      recipient: string;
      channel: string;
      providerRef: string;
    }
  ) {}
}
