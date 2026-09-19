import { KafkaEventBus, createServiceLogger } from '@dukaanpay/common-utils';
import { MerchantCreatedPayload, Merchant } from '@dukaanpay/shared-types';

const logger = createServiceLogger('merchant-kafka-producer');

export class MerchantProducer {
  private eventBus: KafkaEventBus;

  constructor() {
    this.eventBus = new KafkaEventBus('merchant-service');
  }

  public async publishMerchantCreated(merchant: Merchant, correlationId = 'merchant-init'): Promise<void> {
    const payload: MerchantCreatedPayload = {
      merchantId: merchant.id,
      phoneNumber: merchant.phoneNumber,
      businessName: merchant.businessName,
      subscriptionTier: merchant.subscriptionTier,
      preferredLanguage: merchant.preferredLanguage,
    };

    try {
      await this.eventBus.publishEvent(
        'merchant.created',
        merchant.id,
        payload,
        correlationId
      );
      logger.info('Published merchant.created event', { merchantId: merchant.id });
    } catch (err: any) {
      logger.error('Failed to publish merchant.created event', { error: err.message });
    }
  }

  public async publishMerchantUpdated(merchant: Merchant, correlationId = 'merchant-update'): Promise<void> {
    try {
      await this.eventBus.publishEvent(
        'merchant.updated',
        merchant.id,
        merchant,
        correlationId
      );
      logger.info('Published merchant.updated event', { merchantId: merchant.id });
    } catch (err: any) {
      logger.error('Failed to publish merchant.updated event', { error: err.message });
    }
  }
}
