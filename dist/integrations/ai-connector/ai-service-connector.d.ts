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
export declare class AIServiceConnector {
    /**
     * Provides structured merchant transactional & telemetry context to external AI models.
     */
    static getMerchantContext(merchantId: string): Promise<MerchantAIContext>;
    /**
     * Ingests high-impact recommendations and actions proposed by external AI models.
     */
    static ingestRecommendation(proposedAction: AIProposedAction): Promise<{
        actionId: string;
        status: string;
        queuedForApproval: boolean;
    }>;
}
//# sourceMappingURL=ai-service-connector.d.ts.map