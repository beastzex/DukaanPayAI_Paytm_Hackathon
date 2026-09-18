"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const merchant_service_1 = require("../../services/merchant.service");
const zod_1 = require("zod");
const registerMerchantSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(2),
    ownerName: zod_1.z.string().min(2),
    phoneNumber: zod_1.z.string().min(10),
    email: zod_1.z.string().email().optional(),
    category: zod_1.z.string().default('Kirana & FMCG'),
    pincode: zod_1.z.string().min(6),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    kycStatus: zod_1.z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('VERIFIED'),
    preferredLanguage: zod_1.z.string().default('hi'),
    settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).default({}),
});
const updateSettingsSchema = zod_1.z.object({
    settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    version: zod_1.z.number().int().min(1),
});
class MerchantController {
    merchantService = new merchant_service_1.MerchantService();
    getProfile = async (req, res, next) => {
        try {
            const merchantId = req.params.id;
            const profile = await this.merchantService.getProfile(merchantId);
            res.status(200).json({
                success: true,
                data: profile,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    register = async (req, res, next) => {
        try {
            const data = registerMerchantSchema.parse(req.body);
            const merchant = await this.merchantService.register(data);
            res.status(201).json({
                success: true,
                data: merchant,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    updateSettings = async (req, res, next) => {
        try {
            const merchantId = req.params.id;
            const { settings, version } = updateSettingsSchema.parse(req.body);
            const updated = await this.merchantService.updateSettings(merchantId, settings, version);
            res.status(200).json({
                success: true,
                data: updated,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.MerchantController = MerchantController;
//# sourceMappingURL=merchant.controller.js.map