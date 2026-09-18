import { HealthScore, HealthGrade, CreditEligibility } from '@dukaanpay/shared-types';
export interface InsertHealthScoreParams {
    merchantId: string;
    compositeScore: number;
    revenueStabilityScore: number;
    inventoryHealthScore: number;
    customerRetentionScore: number;
    supplierDisciplineScore: number;
    metricsSnapshot: any;
    grade: HealthGrade;
}
export interface InsertCreditEligibilityParams {
    merchantId: string;
    preApprovedAmount: number;
    interestRateMonthly: number;
    tenureDays: number;
    dailySoundboxEscrowDeduction: number;
}
export declare class HealthScoreRepository {
    insertScore(params: InsertHealthScoreParams): Promise<HealthScore>;
    getLatestScore(merchantId: string): Promise<HealthScore | null>;
    upsertCreditEligibility(params: InsertCreditEligibilityParams): Promise<CreditEligibility>;
    getCreditEligibility(merchantId: string): Promise<CreditEligibility | null>;
}
//# sourceMappingURL=HealthScoreRepository.d.ts.map