"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const MerchantService_1 = require("../services/MerchantService");
const shared_validators_1 = require("@dukaanpay/shared-validators");
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
class MerchantController {
    service;
    constructor() {
        this.service = new MerchantService_1.MerchantService();
    }
    register = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.RegisterMerchantSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Validation failed for registration', parsed.error.format());
            }
            const result = await this.service.registerMerchant(parsed.data, req.headers['x-correlation-id']);
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
    login = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.LoginMerchantSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid phone or OTP format', parsed.error.format());
            }
            const result = await this.service.loginWithOtp(parsed.data.phoneNumber, parsed.data.otp);
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
    refreshToken = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.RefreshTokenSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Refresh token required', parsed.error.format());
            }
            const decoded = common_utils_1.AuthService.verifyRefreshToken(parsed.data.refreshToken);
            const profile = await this.service.getProfile(decoded.userId);
            const tokens = common_utils_1.AuthService.generateTokens({
                userId: profile.merchant.id,
                merchantId: profile.merchant.id,
                phoneNumber: profile.merchant.phoneNumber,
                roles: [shared_types_1.UserRole.MERCHANT],
                preferredLanguage: profile.merchant.preferredLanguage,
            });
            res.status(200).json({
                success: true,
                data: { tokens },
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
    getProfile = async (req, res, next) => {
        try {
            const merchantId = req.params.id || req.headers['x-merchant-id'];
            const result = await this.service.getProfile(merchantId);
            res.status(200).json({
                success: true,
                data: result,
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
    updatePreferences = async (req, res, next) => {
        try {
            const merchantId = req.params.id || req.headers['x-merchant-id'];
            const { preferredLanguage, subscriptionTier } = req.body;
            const result = await this.service.updatePreferences(merchantId, preferredLanguage, subscriptionTier, req.headers['x-correlation-id']);
            res.status(200).json({
                success: true,
                data: result,
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
exports.MerchantController = MerchantController;
//# sourceMappingURL=MerchantController.js.map