"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const TransactionService_1 = require("../services/TransactionService");
const shared_validators_1 = require("@dukaanpay/shared-validators");
const common_utils_1 = require("@dukaanpay/common-utils");
class TransactionController {
    service;
    constructor() {
        this.service = new TransactionService_1.TransactionService();
    }
    ingest = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.IngestTransactionSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid transaction payload', parsed.error.format());
            }
            const txn = await this.service.ingestTransaction(parsed.data, req.headers['x-correlation-id'] || 'txn-ingest');
            const response = {
                success: true,
                data: txn,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getVelocity = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            const days = req.query.days ? parseInt(req.query.days, 10) : 7;
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId query param or header required');
            }
            const velocity = await this.service.getVelocityAnalytics(merchantId, days);
            res.status(200).json({
                success: true,
                data: velocity,
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
    getHourlyDistribution = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            const days = req.query.days ? parseInt(req.query.days, 10) : 30;
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId query param or header required');
            }
            const distribution = await this.service.getHourlyFootfallPattern(merchantId, days);
            res.status(200).json({
                success: true,
                data: distribution,
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
    getHistory = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const history = await this.service.getHistory(merchantId, limit);
            res.status(200).json({
                success: true,
                data: history,
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
    getLostRevenue = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'] || 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
            const analysis = await this.service.getLostRevenue(merchantId);
            res.status(200).json({
                success: true,
                data: analysis,
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
    getMarketBenchmark = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'] || 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
            const benchmark = await this.service.getMarketBenchmark(merchantId);
            res.status(200).json({
                success: true,
                data: benchmark,
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
exports.TransactionController = TransactionController;
//# sourceMappingURL=TransactionController.js.map