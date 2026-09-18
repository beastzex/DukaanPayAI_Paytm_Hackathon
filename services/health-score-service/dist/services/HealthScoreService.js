"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthScoreService = void 0;
const HealthScoreRepository_1 = require("../repositories/HealthScoreRepository");
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
const logger = (0, common_utils_1.createServiceLogger)('health-score-service');
class HealthScoreService {
    repo;
    eventBus;
    constructor() {
        this.repo = new HealthScoreRepository_1.HealthScoreRepository();
        this.eventBus = new common_utils_1.KafkaEventBus('health-score-service');
    }
    calculateGrade(compositeScore) {
        if (compositeScore >= 90)
            return shared_types_1.HealthGrade.AAA;
        if (compositeScore >= 75)
            return shared_types_1.HealthGrade.AA;
        if (compositeScore >= 60)
            return shared_types_1.HealthGrade.A;
        if (compositeScore >= 45)
            return shared_types_1.HealthGrade.B;
        return shared_types_1.HealthGrade.C;
    }
    async evaluateHealthScore(merchantId, inputs, correlationId = 'health-calc') {
        // Exact Weighted Formula:
        // 35% Revenue Stability + 25% Inventory Health + 20% Customer Retention + 20% Supplier Settlement Discipline
        const revenueScore = Math.min(100, Math.max(0, inputs.dailyRevenueStabilityIndex));
        const inventoryScore = Math.min(100, Math.max(0, inputs.stockoutAvoidanceRatio));
        const retentionScore = Math.min(100, Math.max(0, inputs.customerRetentionRatio));
        const supplierScore = Math.min(100, Math.max(0, inputs.supplierPaymentDiscipline));
        const compositeScore = Number((revenueScore * 0.35 +
            inventoryScore * 0.25 +
            retentionScore * 0.20 +
            supplierScore * 0.20).toFixed(2));
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
        let creditEligibility;
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
        const payload = {
            merchantId,
            compositeScore,
            grade,
            preApprovedLoanAmount: creditEligibility?.preApprovedAmount,
        };
        await this.eventBus.publishEvent('healthscore.updated', merchantId, payload, correlationId);
        logger.info(`Evaluated health score for merchant ${merchantId}: ${compositeScore} (${grade})`);
        return { score: scoreRecord, creditEligibility };
    }
    async getLatestScore(merchantId) {
        return this.repo.getLatestScore(merchantId);
    }
    async getCreditLine(merchantId) {
        return this.repo.getCreditEligibility(merchantId);
    }
}
exports.HealthScoreService = HealthScoreService;
//# sourceMappingURL=HealthScoreService.js.map