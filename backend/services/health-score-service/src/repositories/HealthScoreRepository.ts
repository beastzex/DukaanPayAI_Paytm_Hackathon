import { DatabaseService } from '@dukaanpay/common-utils';
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

export class HealthScoreRepository {
  public async insertScore(params: InsertHealthScoreParams): Promise<HealthScore> {
    const query = `
      INSERT INTO health_scores (
        merchant_id, composite_score, revenue_stability_score, 
        inventory_health_score, customer_retention_score, 
        supplier_discipline_score, metrics_snapshot, grade
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, merchant_id as "merchantId", composite_score as "compositeScore", 
                revenue_stability_score as "revenueStabilityScore", 
                inventory_health_score as "inventoryHealthScore", 
                customer_retention_score as "customerRetentionScore", 
                supplier_discipline_score as "supplierDisciplineScore", 
                metrics_snapshot as "metricsSnapshot", grade, evaluated_at as "evaluatedAt"
    `;
    const values = [
      params.merchantId,
      params.compositeScore,
      params.revenueStabilityScore,
      params.inventoryHealthScore,
      params.customerRetentionScore,
      params.supplierDisciplineScore,
      JSON.stringify(params.metricsSnapshot),
      params.grade,
    ];
    const result = await DatabaseService.query<HealthScore>(query, values);
    return result.rows[0];
  }

  public async getLatestScore(merchantId: string): Promise<HealthScore | null> {
    const query = `
      SELECT id, merchant_id as "merchantId", composite_score as "compositeScore", 
             revenue_stability_score as "revenueStabilityScore", 
             inventory_health_score as "inventoryHealthScore", 
             customer_retention_score as "customerRetentionScore", 
             supplier_discipline_score as "supplierDisciplineScore", 
             metrics_snapshot as "metricsSnapshot", grade, evaluated_at as "evaluatedAt"
      FROM health_scores
      WHERE merchant_id = $1
      ORDER BY evaluated_at DESC
      LIMIT 1
    `;
    const result = await DatabaseService.query<HealthScore>(query, [merchantId]);
    return result.rows[0] || null;
  }

  public async upsertCreditEligibility(params: InsertCreditEligibilityParams): Promise<CreditEligibility> {
    const query = `
      INSERT INTO credit_eligibility (
        merchant_id, pre_approved_amount, interest_rate_monthly, 
        tenure_days, daily_soundbox_escrow_deduction, status
      ) VALUES ($1, $2, $3, $4, $5, 'OFFERED')
      RETURNING id, merchant_id as "merchantId", pre_approved_amount as "preApprovedAmount", 
                interest_rate_monthly as "interestRateMonthly", tenure_days as "tenureDays", 
                daily_soundbox_escrow_deduction as "dailySoundboxEscrowDeduction", 
                status, created_at as "createdAt"
    `;
    const values = [
      params.merchantId,
      params.preApprovedAmount,
      params.interestRateMonthly,
      params.tenureDays,
      params.dailySoundboxEscrowDeduction,
    ];
    const result = await DatabaseService.query<CreditEligibility>(query, values);
    return result.rows[0];
  }

  public async getCreditEligibility(merchantId: string): Promise<CreditEligibility | null> {
    const query = `
      SELECT id, merchant_id as "merchantId", pre_approved_amount as "preApprovedAmount", 
             interest_rate_monthly as "interestRateMonthly", tenure_days as "tenureDays", 
             daily_soundbox_escrow_deduction as "dailySoundboxEscrowDeduction", 
             status, created_at as "createdAt"
      FROM credit_eligibility
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const result = await DatabaseService.query<CreditEligibility>(query, [merchantId]);
    return result.rows[0] || null;
  }
}
