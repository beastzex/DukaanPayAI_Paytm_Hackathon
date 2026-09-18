"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantRepository = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const shared_types_1 = require("@dukaanpay/shared-types");
class MerchantRepository {
    async findById(id) {
        const query = `
      SELECT id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
             email, full_name as "fullName", business_name as "businessName", 
             kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
             preferred_language as "preferredLanguage", is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM merchants
      WHERE id = $1
    `;
        const result = await common_utils_1.DatabaseService.query(query, [id]);
        return result.rows[0] || null;
    }
    async findByPhoneNumber(phoneNumber) {
        const query = `
      SELECT id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
             email, full_name as "fullName", business_name as "businessName", 
             kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
             preferred_language as "preferredLanguage", is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM merchants
      WHERE phone_number = $1
    `;
        const result = await common_utils_1.DatabaseService.query(query, [phoneNumber]);
        return result.rows[0] || null;
    }
    async createMerchant(params) {
        const merchantCode = `MER_${Date.now().toString().slice(-6)}_${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
        const query = `
      INSERT INTO merchants (
        merchant_code, phone_number, full_name, business_name, email, 
        preferred_language, subscription_tier, kyc_status, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
                email, full_name as "fullName", business_name as "businessName", 
                kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
                preferred_language as "preferredLanguage", is_active as "isActive", 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
        const values = [
            merchantCode,
            params.phoneNumber,
            params.fullName,
            params.businessName,
            params.email || null,
            params.preferredLanguage,
            params.subscriptionTier,
            shared_types_1.KycStatus.VERIFIED, // auto-verified for Paytm Soundbox registered merchants
            true,
        ];
        const result = await common_utils_1.DatabaseService.query(query, values);
        return result.rows[0];
    }
    async createStore(params) {
        const query = `
      INSERT INTO stores (
        merchant_id, store_name, address_line, city, state, pincode, 
        soundbox_device_id, upi_vpa
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, merchant_id as "merchantId", store_name as "storeName", 
                address_line as "addressLine", city, state, pincode, 
                soundbox_device_id as "soundboxDeviceId", upi_vpa as "upiVpa", 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
        const values = [
            params.merchantId,
            params.storeName,
            params.addressLine,
            params.city,
            params.state,
            params.pincode,
            params.soundboxDeviceId || null,
            params.upiVpa,
        ];
        const result = await common_utils_1.DatabaseService.query(query, values);
        return result.rows[0];
    }
    async findStoresByMerchantId(merchantId) {
        const query = `
      SELECT id, merchant_id as "merchantId", store_name as "storeName", 
             address_line as "addressLine", city, state, pincode, 
             soundbox_device_id as "soundboxDeviceId", upi_vpa as "upiVpa", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM stores
      WHERE merchant_id = $1
    `;
        const result = await common_utils_1.DatabaseService.query(query, [merchantId]);
        return result.rows;
    }
    async updatePreferences(merchantId, preferredLanguage, subscriptionTier) {
        const query = `
      UPDATE merchants
      SET preferred_language = $1, subscription_tier = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
                email, full_name as "fullName", business_name as "businessName", 
                kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
                preferred_language as "preferredLanguage", is_active as "isActive", 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
        const result = await common_utils_1.DatabaseService.query(query, [preferredLanguage, subscriptionTier, merchantId]);
        return result.rows[0] || null;
    }
}
exports.MerchantRepository = MerchantRepository;
//# sourceMappingURL=MerchantRepository.js.map