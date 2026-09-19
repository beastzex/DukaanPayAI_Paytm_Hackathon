import { PostgresMerchantRepository } from '../repositories/postgres/postgres-repositories';
import { MerchantEntity } from '../domain/entities/entities';
import { CacheAside } from '../infrastructure/redis/cache-aside';
import { KafkaEventBus, KAFKA_TOPICS } from '../events/kafka-client';
import { EntityNotFoundException, ConflictException } from '../domain/exceptions/domain-exceptions';
import { logger } from '../monitoring/logger';

export class MerchantService {
  private merchantRepo = new PostgresMerchantRepository();

  public async getProfile(id: string): Promise<MerchantEntity> {
    const cacheKey = `cache:merchant:${id}`;

    return CacheAside.getOrSet(
      cacheKey,
      async () => {
        const merchant = await this.merchantRepo.findById(id);
        if (!merchant) {
          throw new EntityNotFoundException('Merchant', id);
        }
        return merchant;
      },
      3600, // 1 hour TTL
      'merchants'
    );
  }

  public async register(
    data: Omit<MerchantEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>
  ): Promise<MerchantEntity> {
    const existing = await this.merchantRepo.findByPhone(data.phoneNumber);
    if (existing) {
      throw new ConflictException(`Merchant with phone ${data.phoneNumber} already registered`);
    }

    const created = await this.merchantRepo.create(data);

    // Invalidate profile cache and publish domain event
    await CacheAside.invalidate(`cache:merchant:${created.id}`);
    await KafkaEventBus.publish(
      KAFKA_TOPICS.MERCHANT_CREATED,
      created.id,
      {
        merchantId: created.id,
        businessName: created.businessName,
        phoneNumber: created.phoneNumber,
        city: created.city,
      }
    );

    logger.info({ merchantId: created.id }, 'Merchant registered and domain event published');
    return created;
  }

  public async updateSettings(
    id: string,
    settings: Record<string, any>,
    expectedVersion: number
  ): Promise<MerchantEntity> {
    const updated = await this.merchantRepo.update(id, { settings }, expectedVersion);

    // Invalidate Redis cache
    await CacheAside.invalidate(`cache:merchant:${id}`);

    // Emit event
    await KafkaEventBus.publish(
      KAFKA_TOPICS.MERCHANT_UPDATED,
      id,
      { merchantId: id, fieldsUpdated: ['settings'] }
    );

    logger.info({ merchantId: id, version: updated.version }, 'Merchant settings updated with optimistic locking');
    return updated;
  }
}
