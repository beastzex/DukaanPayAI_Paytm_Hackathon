import { AuditLogEntity } from '../domain/entities/entities';
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
export declare class AnalyticsService {
    private auditRepo;
    recordAuditLog(dto: RecordAuditEventDto): Promise<AuditLogEntity>;
    getAuditLogs(actorId: string, limit?: number): Promise<AuditLogEntity[]>;
    getPlatformMetrics(): Promise<Record<string, any>>;
}
//# sourceMappingURL=analytics.service.d.ts.map