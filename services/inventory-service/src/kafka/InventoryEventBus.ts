import { KafkaEventBus, createServiceLogger } from '@dukaanpay/common-utils';
import { InventoryAlertPayload, BaseKafkaEvent, InvoiceProcessedPayload } from '@dukaanpay/shared-types';
import { InventoryRepository } from '../repositories/InventoryRepository';

const logger = createServiceLogger('inventory-kafka-bus');

export class InventoryEventBus {
  private eventBus: KafkaEventBus;
  private repo: InventoryRepository;

  constructor() {
    this.eventBus = new KafkaEventBus('inventory-service');
    this.repo = new InventoryRepository();
  }

  public async publishInventoryAlert(payload: InventoryAlertPayload, correlationId = 'stock-alert'): Promise<void> {
    try {
      await this.eventBus.publishEvent('inventory.alert', payload.storeId, payload, correlationId);
      logger.warn(`Published inventory.alert for SKU: ${payload.productName}`, {
        skuCode: payload.skuCode,
        currentStock: payload.currentStock,
      });
    } catch (err: any) {
      logger.error('Failed to publish inventory.alert', { error: err.message });
    }
  }

  public async startConsumers(): Promise<void> {
    try {
      await this.eventBus.startConsumer(
        'inventory-service-group',
        ['invoice.processed'],
        async (event: BaseKafkaEvent<InvoiceProcessedPayload>) => {
          if (event.eventType === 'invoice.processed') {
            logger.info(`Processing invoice.processed event to auto-restock: ${event.payload.invoiceId}`);
            // In production, fetch line items and call repo.updateStockUnits()
          }
        }
      );
    } catch (err: any) {
      logger.error('Kafka consumer error in InventoryService', { error: err.message });
    }
  }
}
