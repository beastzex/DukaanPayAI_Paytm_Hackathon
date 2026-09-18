"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthScoreController = void 0;
const HealthScoreService_1 = require("../services/HealthScoreService");
const common_utils_1 = require("@dukaanpay/common-utils");
class HealthScoreController {
    service;
    constructor() {
        this.service = new HealthScoreService_1.HealthScoreService();
    }
    evaluate = async (req, res, next) => {
        try {
            const merchantId = req.body.merchantId || req.headers['x-merchant-id'];
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const { dailyRevenueStabilityIndex, stockoutAvoidanceRatio, customerRetentionRatio, supplierPaymentDiscipline, rolling30dRevenue, } = req.body;
            const result = await this.service.evaluateHealthScore(merchantId, {
                dailyRevenueStabilityIndex: dailyRevenueStabilityIndex ?? 82,
                stockoutAvoidanceRatio: stockoutAvoidanceRatio ?? 78,
                customerRetentionRatio: customerRetentionRatio ?? 85,
                supplierPaymentDiscipline: supplierPaymentDiscipline ?? 90,
                rolling30dRevenue: rolling30dRevenue ?? 185000,
            }, req.headers['x-correlation-id'] || 'health-calc');
            const response = {
                success: true,
                data: result,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getScore = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const score = await this.service.getLatestScore(merchantId);
            res.status(200).json({
                success: true,
                data: score,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCredit = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const credit = await this.service.getCreditLine(merchantId);
            res.status(200).json({
                success: true,
                data: credit,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.HealthScoreController = HealthScoreController;
//# sourceMappingURL=HealthScoreController.js.map