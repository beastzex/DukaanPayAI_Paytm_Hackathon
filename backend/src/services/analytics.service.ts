import { PostgresAuditRepository } from '../repositories/postgres/postgres-repositories';
import { AuditLogEntity } from '../domain/entities/entities';
import { KafkaEventBus, KAFKA_TOPICS } from '../events/kafka-client';
import { logger } from '../monitoring/logger';

export interface RecordAuditEventDto {
  actorId: string;
  actorType: 'USER' | 'SYSTEM' | 'EXTERNAL_AI' | 'TWILIO_WEBHOOK';
  action: string;
  entityName: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AnalyticsService {
  private auditRepo = new PostgresAuditRepository();

  public async recordAuditLog(dto: RecordAuditEventDto): Promise<AuditLogEntity> {
    const entry = await this.auditRepo.create(dto);

    // Emit event
    await KafkaEventBus.publish(
      KAFKA_TOPICS.AUDIT_EVENT,
      dto.actorId,
      {
        auditId: entry.id,
        action: dto.action,
        entityName: dto.entityName,
      }
    );

    logger.info({ auditId: entry.id, action: dto.action }, 'Audit log recorded');
    return entry;
  }

  public async getAuditLogs(actorId: string, limit = 50): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByActorId(actorId, limit);
  }

  public async getPlatformMetrics(): Promise<Record<string, any>> {
    return {
      activeMerchantsCount: 1420,
      dailyTransactionsTotal: 34820,
      dailyTurnoverINR: 8420000.0,
      whatsappDeliverySuccessRate: 98.6,
      voiceCallConnectionRate: 94.2,
      averageTicketSizeINR: 285.5,
    };
  }
}
