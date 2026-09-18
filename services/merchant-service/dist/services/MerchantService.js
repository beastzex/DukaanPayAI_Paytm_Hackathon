"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantService = void 0;
const MerchantRepository_1 = require("../repositories/MerchantRepository");
const MerchantProducer_1 = require("../kafka/MerchantProducer");
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
class MerchantService {
    merchantRepo;
    producer;
    constructor() {
        this.merchantRepo = new MerchantRepository_1.MerchantRepository();
        this.producer = new MerchantProducer_1.MerchantProducer();
    }
    async registerMerchant(input, correlationId = 'reg-init') {
        const existing = await this.merchantRepo.findByPhoneNumber(input.phoneNumber);
        if (existing) {
            throw new common_utils_1.ConflictError('A merchant with this mobile number already exists');
        }
        const merchant = await this.merchantRepo.createMerchant({
            phoneNumber: input.phoneNumber,
            fullName: input.fullName,
            businessName: input.businessName,
            email: input.email,
            preferredLanguage: input.preferredLanguage,
            subscriptionTier: input.subscriptionTier,
        });
        const store = await this.merchantRepo.createStore({
            merchantId: merchant.id,
            storeName: input.businessName,
            addressLine: input.addressLine,
            city: input.city,
            state: input.state,
            pincode: input.pincode,
            soundboxDeviceId: input.soundboxDeviceId,
            upiVpa: input.upiVpa,
        });
        // Generate JWT access & refresh tokens
        const tokens = common_utils_1.AuthService.generateTokens({
            userId: merchant.id,
            merchantId: merchant.id,
            phoneNumber: merchant.phoneNumber,
            roles: [shared_types_1.UserRole.MERCHANT],
            preferredLanguage: merchant.preferredLanguage,
        });
        // Publish event to Kafka
        await this.producer.publishMerchantCreated(merchant, correlationId);
        return { merchant, store, tokens };
    }
    async loginWithOtp(phoneNumber, otp) {
        // In production, verify OTP via SMS Gateway (e.g. Gupshup/Twilio).
        // For test/hackathon credentials, OTP '123456' or valid 6-digit is accepted.
        if (otp !== '123456' && process.env.NODE_ENV === 'production') {
            throw new common_utils_1.ConflictError('Invalid OTP entered');
        }
        const merchant = await this.merchantRepo.findByPhoneNumber(phoneNumber);
        if (!merchant) {
            throw new common_utils_1.NotFoundError('Merchant account');
        }
        const tokens = common_utils_1.AuthService.generateTokens({
            userId: merchant.id,
            merchantId: merchant.id,
            phoneNumber: merchant.phoneNumber,
            roles: [shared_types_1.UserRole.MERCHANT],
            preferredLanguage: merchant.preferredLanguage,
        });
        return { merchant, tokens };
    }
    async getProfile(merchantId) {
        const merchant = await this.merchantRepo.findById(merchantId);
        if (!merchant) {
            throw new common_utils_1.NotFoundError('Merchant');
        }
        const stores = await this.merchantRepo.findStoresByMerchantId(merchantId);
        return { merchant, stores };
    }
    async updatePreferences(merchantId, language, tier, correlationId = 'pref-update') {
        const updated = await this.merchantRepo.updatePreferences(merchantId, language, tier);
        if (!updated) {
            throw new common_utils_1.NotFoundError('Merchant');
        }
        await this.producer.publishMerchantUpdated(updated, correlationId);
        return updated;
    }
}
exports.MerchantService = MerchantService;
//# sourceMappingURL=MerchantService.js.map