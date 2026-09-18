import { HealthScore, HealthGrade, CreditEligibility } from '@dukaanpay/shared-types';
export interface MetricInputs {
    dailyRevenueStabilityIndex: number;
    stockoutAvoidanceRatio: number;
    customerRetentionRatio: number;
    supplierPaymentDiscipline: number;
    rolling30dRevenue: number;
}
export declare class HealthScoreService {
    private repo;
    private eventBus;
    constructor();
    calculateGrade(compositeScore: number): HealthGrade;
    evaluateHealthScore(merchantId: string, inputs: MetricInputs, correlationId?: string): Promise<{
        score: HealthScore;
        creditEligibility?: CreditEligibility;
    }>;
    getLatestScore(merchantId: string): Promise<HealthScore | null>;
    getCreditLine(merchantId: string): Promise<CreditEligibility | null>;
}
//# sourceMappingURL=HealthScoreService.d.ts.map