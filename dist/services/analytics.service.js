"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const postgres_repositories_1 = require("../repositories/postgres/postgres-repositories");
const kafka_client_1 = require("../events/kafka-client");
const logger_1 = require("../monitoring/logger");
class AnalyticsService {
    auditRepo = new postgres_repositories_1.PostgresAuditRepository();
    async recordAuditLog(dto) {
        const entry = await this.auditRepo.create(dto);
        // Emit event
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.AUDIT_EVENT, dto.actorId, {
            auditId: entry.id,
            action: dto.action,
            entityName: dto.entityName,
        });
        logger_1.logger.info({ auditId: entry.id, action: dto.action }, 'Audit log recorded');
        return entry;
    }
    async getAuditLogs(actorId, limit = 50) {
        return this.auditRepo.findByActorId(actorId, limit);
    }
    async getPlatformMetrics() {
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
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map