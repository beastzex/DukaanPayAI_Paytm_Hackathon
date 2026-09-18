"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIIntegrationController = void 0;
const integration_service_1 = require("../../services/integration.service");
const zod_1 = require("zod");
const aiActionSchema = zod_1.z.object({
    merchantId: zod_1.z.string(),
    actionType: zod_1.z.enum(['STOCK_RESTOCK', 'WINBACK_CAMPAIGN', 'FESTIVAL_BUFFER', 'UDHAAR_RECOVERY']),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    title: zod_1.z.string().min(3),
    rationaleIndic: zod_1.z.string(),
    projectedRevenueINR: zod_1.z.number(),
    payload: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    requiresMerchantApproval: zod_1.z.boolean().default(true),
});
class AIIntegrationController {
    integrationService = new integration_service_1.IntegrationService();
    getMerchantContext = async (req, res, next) => {
        try {
            const merchantId = req.params.id;
            const context = await this.integrationService.getMerchantAIContext(merchantId);
            res.status(200).json({
                success: true,
                data: context,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    ingestRecommendation = async (req, res, next) => {
        try {
            const data = aiActionSchema.parse(req.body);
            const result = await this.integrationService.ingestAIAction(data);
            res.status(201).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AIIntegrationController = AIIntegrationController;
//# sourceMappingURL=ai-integration.controller.js.map