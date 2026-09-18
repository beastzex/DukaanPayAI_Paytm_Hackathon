"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServiceConnector = void 0;
const kafka_client_1 = require("../../events/kafka-client");
const queue_manager_1 = require("../../workers/queue-manager");
const logger_1 = require("../../monitoring/logger");
const uuid_1 = require("uuid");
class AIServiceConnector {
    /**
     * Provides structured merchant transactional & telemetry context to external AI models.
     */
    static async getMerchantContext(merchantId) {
        logger_1.logger.info({ merchantId }, 'Fetching structured context for external AI model evaluation');
        // Return high-fidelity merchant feature vector for external AI consumption
        return {
            merchantId,
            businessName: 'गुप्ता किराना स्टोर (Gupta Kirana Store)',
            pincode: '208006',
            rolling7dRevenueINR: 48250.0,
            avgDailyTransactions: 24,
            lowStockItemsCount: 3,
            lapsedCustomersCount: 42,
            pendingUdhaarTotalINR: 14200.0,
            externalSignals: {
                temperatureC: 38.5,
                hasActiveFestival: true,
                festivalName: 'Navratri',
                hasCricketMatch: true,
            },
        };
    }
    /**
     * Ingests high-impact recommendations and actions proposed by external AI models.
     */
    static async ingestRecommendation(proposedAction) {
        const actionId = proposedAction.actionId || `act_${(0, uuid_1.v4)()}`;
        logger_1.logger.info({ actionId, merchantId: proposedAction.merchantId, type: proposedAction.actionType }, 'Ingested growth recommendation from external AI service');
        // Publish event to Kafka event bus
        await kafka_client_1.KafkaEventBus.publish(kafka_client_1.KAFKA_TOPICS.AUDIT_EVENT, proposedAction.merchantId, {
            actionId,
            actionType: proposedAction.actionType,
            source: 'EXTERNAL_AI_TEAM_SERVICE',
            timestamp: new Date().toISOString(),
        });
        // If actionable campaign, enqueue to Campaign queue
        if (proposedAction.actionType === 'WINBACK_CAMPAIGN') {
            await queue_manager_1.QueueManager.enqueue(queue_manager_1.QUEUE_NAMES.CAMPAIGN, 'process_ai_campaign_draft', {
                actionId,
                merchantId: proposedAction.merchantId,
                payload: proposedAction.payload,
            });
        }
        return {
            actionId,
            status: 'INGESTED',
            queuedForApproval: proposedAction.requiresMerchantApproval,
        };
    }
}
exports.AIServiceConnector = AIServiceConnector;
//# sourceMappingURL=ai-service-connector.js.map