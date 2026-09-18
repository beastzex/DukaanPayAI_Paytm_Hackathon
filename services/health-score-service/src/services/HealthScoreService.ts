import { HealthScoreRepository } from '../repositories/HealthScoreRepository';
import { KafkaEventBus, createServiceLogger } from '@dukaanpay/common-utils';
import { HealthScore, HealthGrade, CreditEligibility, HealthScoreUpdatedPayload } from '@dukaanpay/shared-types';

const logger = createServiceLogger('health-score-service');

export interface MetricInputs {
  dailyRevenueStabilityIndex: number; // 0-100 based on standard deviation of daily UPI sales
  stockoutAvoidanceRatio: number;      // 0-100 based on active SKU stock availability
  customerRetentionRatio: number;      // 0-100 based on 30-day repeat customer visits
  supplierPaymentDiscipline: number;   // 0-100 based on on-time distributor invoice settlements
  rolling30dRevenue: number;
}

export class HealthScoreService {
  private repo: HealthScoreRepository;
  private eventBus: KafkaEventBus;

  constructor() {
    this.repo = new HealthScoreRepository();
    this.eventBus = new KafkaEventBus('health-score-service');
  }

  public calculateGrade(compositeScore: number): HealthGrade {
    if (compositeScore >= 90) return HealthGrade.AAA;
    if (compositeScore >= 75) return HealthGrade.AA;
    if (compositeScore >= 60) return HealthGrade.A;
    if (compositeScore >= 45) return HealthGrade.B;
    return HealthGrade.C;
  }

  public async evaluateHealthScore(
    merchantId: string,
    inputs: MetricInputs,
    correlationId = 'health-calc'
  ): Promise<{ score: HealthScore; creditEligibility?: CreditEligibility }> {
    // Exact Weighted Formula:
    // 35% Revenue Stability + 25% Inventory Health + 20% Customer Retention + 20% Supplier Settlement Discipline
    const revenueScore = Math.min(100, Math.max(0, inputs.dailyRevenueStabilityIndex));
    const inventoryScore = Math.min(100, Math.max(0, inputs.stockoutAvoidanceRatio));
    const retentionScore = Math.min(100, Math.max(0, inputs.customerRetentionRatio));
    const supplierScore = Math.min(100, Math.max(0, inputs.supplierPaymentDiscipline));

    const compositeScore = Number(
      (
        revenueScore * 0.35 +
        inventoryScore * 0.25 +
        retentionScore * 0.20 +
        supplierScore * 0.20
      ).toFixed(2)
    );

    const grade = this.calculateGrade(compositeScore);

    const scoreRecord = await this.repo.insertScore({
      merchantId,
      compositeScore,
      revenueStabilityScore: revenueScore,
      inventoryHealthScore: inventoryScore,
      customerRetentionScore: retentionScore,
      supplierDisciplineScore: supplierScore,
      metricsSnapshot: {
        rolling30dRevenue: inputs.rolling30dRevenue,
        dailyRevenueStabilityIndex: inputs.dailyRevenueStabilityIndex,
        stockoutAvoidanceRatio: inputs.stockoutAvoidanceRatio,
        customerRetentionRatio: inputs.customerRetentionRatio,
        supplierPaymentDiscipline: inputs.supplierPaymentDiscipline,
      },
      grade,
    });

    let creditEligibility: CreditEligibility | undefined;

    // Automated credit line underwriting for Grade A and above
    if (compositeScore >= 60) {
      // Loan pre-approval multiplier: 1.2x to 2.5x of monthly revenue based on score tier
      const multiplier = compositeScore >= 90 ? 2.5 : compositeScore >= 75 ? 1.8 : 1.2;
      const preApprovedAmount = Math.round((inputs.rolling30dRevenue * multiplier) / 1000) * 1000;
      const tenureDays = 90; // 3 months micro-working capital
      // Daily escrow deduction deducted automatically from morning Soundbox collections
      const dailyDeduction = Math.round((preApprovedAmount * 1.04) / tenureDays); // 4% flat 90-day interest

      creditEligibility = await this.repo.upsertCreditEligibility({
        merchantId,
        preApprovedAmount,
        interestRateMonthly: 1.33,
        tenureDays,
        dailySoundboxEscrowDeduction: dailyDeduction,
      });
    }

    // Publish Kafka event
    const payload: HealthScoreUpdatedPayload = {
      merchantId,
      compositeScore,
      grade,
      preApprovedLoanAmount: creditEligibility?.preApprovedAmount,
    };

    await this.eventBus.publishEvent('healthscore.updated', merchantId, payload, correlationId);
    logger.info(`Evaluated health score for merchant ${merchantId}: ${compositeScore} (${grade})`);

    return { score: scoreRecord, creditEligibility };
  }

  public async getLatestScore(merchantId: string): Promise<HealthScore | null> {
    return this.repo.getLatestScore(merchantId);
  }

  public async getCreditLine(merchantId: string): Promise<CreditEligibility | null> {
    return this.repo.getCreditEligibility(merchantId);
  }
}
