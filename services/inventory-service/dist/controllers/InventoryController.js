"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const InventoryService_1 = require("../services/InventoryService");
const shared_validators_1 = require("@dukaanpay/shared-validators");
const common_utils_1 = require("@dukaanpay/common-utils");
class InventoryController {
    service;
    constructor() {
        this.service = new InventoryService_1.InventoryService();
    }
    createSKU = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.CreateSKUSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid SKU payload', parsed.error.format());
            }
            const merchantId = req.body.merchantId || req.headers['x-merchant-id'];
            const storeId = req.body.storeId || req.headers['x-store-id'];
            if (!merchantId || !storeId) {
                throw new common_utils_1.ValidationError('merchantId and storeId required');
            }
            const result = await this.service.registerSKU(merchantId, storeId, parsed.data);
            const response = {
                success: true,
                data: result,
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
    updateStock = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.UpdateStockSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid stock update payload', parsed.error.format());
            }
            const updated = await this.service.updateStock(parsed.data, req.headers['x-correlation-id'] || 'stock-update');
            res.status(200).json({
                success: true,
                data: updated,
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
    getStatus = async (req, res, next) => {
        try {
            const storeId = req.query.storeId || req.headers['x-store-id'];
            if (!storeId) {
                throw new common_utils_1.ValidationError('storeId query param required');
            }
            const items = await this.service.getInventoryStatus(storeId);
            res.status(200).json({
                success: true,
                data: items,
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
    getLowStockAlerts = async (req, res, next) => {
        try {
            const storeId = req.query.storeId || req.headers['x-store-id'];
            if (!storeId) {
                throw new common_utils_1.ValidationError('storeId query param required');
            }
            const alerts = await this.service.getLowStockAlerts(storeId);
            res.status(200).json({
                success: true,
                data: alerts,
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
exports.InventoryController = InventoryController;
//# sourceMappingURL=InventoryController.js.map