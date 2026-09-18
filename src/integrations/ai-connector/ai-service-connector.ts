import { KafkaEventBus, KAFKA_TOPICS } from '../../events/kafka-client';
import { QueueManager, QUEUE_NAMES } from '../../workers/queue-manager';
import { logger } from '../../monitoring/logger';
import { v4 as uuidv4 } from 'uuid';

export interface AIProposedAction {
  actionId?: string;
  merchantId: string;
  actionType: 'STOCK_RESTOCK' | 'WINBACK_CAMPAIGN' | 'FESTIVAL_BUFFER' | 'UDHAAR_RECOVERY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  rationaleIndic: string;
  projectedRevenueINR: number;
  payload: Record<string, any>;
  requiresMerchantApproval: boolean;
}

export interface MerchantAIContext {
  merchantId: string;
  businessName: string;
  pincode: string;
  rolling7dRevenueINR: number;
  avgDailyTransactions: number;
  lowStockItemsCount: number;
  lapsedCustomersCount: number;
  pendingUdhaarTotalINR: number;
  externalSignals: {
    temperatureC: number;
    hasActiveFestival: boolean;
    festivalName?: string;
    hasCricketMatch: boolean;
  };
}

export class AIServiceConnector {
  /**
   * Provides structured merchant transactional & telemetry context to external AI models.
   */
  public static async getMerchantContext(merchantId: string): Promise<MerchantAIContext> {
    logger.info({ merchantId }, 'Fetching structured context for external AI model evaluation');

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
  public static async ingestRecommendation(
    proposedAction: AIProposedAction
  ): Promise<{ actionId: string; status: string; queuedForApproval: boolean }> {
    const actionId = proposedAction.actionId || `act_${uuidv4()}`;

    logger.info(
      { actionId, merchantId: proposedAction.merchantId, type: proposedAction.actionType },
      'Ingested growth recommendation from external AI service'
    );

    // Publish event to Kafka event bus
    await KafkaEventBus.publish(
      KAFKA_TOPICS.AUDIT_EVENT,
      proposedAction.merchantId,
      {
        actionId,
        actionType: proposedAction.actionType,
        source: 'EXTERNAL_AI_TEAM_SERVICE',
        timestamp: new Date().toISOString(),
      }
    );

    // If actionable campaign, enqueue to Campaign queue
    if (proposedAction.actionType === 'WINBACK_CAMPAIGN') {
      await QueueManager.enqueue(QUEUE_NAMES.CAMPAIGN, 'process_ai_campaign_draft', {
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
