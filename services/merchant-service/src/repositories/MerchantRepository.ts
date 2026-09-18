import { DatabaseService } from '@dukaanpay/common-utils';
import { Merchant, Store, KycStatus, SubscriptionTier, IndicLanguage } from '@dukaanpay/shared-types';

export interface CreateMerchantParams {
  phoneNumber: string;
  fullName: string;
  businessName: string;
  email?: string;
  preferredLanguage: IndicLanguage;
  subscriptionTier: SubscriptionTier;
}

export interface CreateStoreParams {
  merchantId: string;
  storeName: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  soundboxDeviceId?: string;
  upiVpa: string;
}

export class MerchantRepository {
  public async findById(id: string): Promise<Merchant | null> {
    const query = `
      SELECT id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
             email, full_name as "fullName", business_name as "businessName", 
             kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
             preferred_language as "preferredLanguage", is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM merchants
      WHERE id = $1
    `;
    const result = await DatabaseService.query<Merchant>(query, [id]);
    return result.rows[0] || null;
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<Merchant | null> {
    const query = `
      SELECT id, merchant_code as "merchantCode", phone_number as "phoneNumber", 
             email, full_name as "fullName", business_name as "businessName", 
             kyc_status as "kycStatus", subscription_tier as "subscriptionTier", 
             preferred_language as "preferredLanguage", is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM merchants
      WHERE phone_number = $1
    `;
    const result = await DatabaseService.query<Merchant>(query, [phoneNumber]);
    return result.rows[0] || null;
  }

  public async createMerchant(params: CreateMerchantParams): Promise<Merchant> {
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
      KycStatus.VERIFIED, // auto-verified for Paytm Soundbox registered merchants
      true,
    ];
    const result = await DatabaseService.query<Merchant>(query, values);
    return result.rows[0];
  }

  public async createStore(params: CreateStoreParams): Promise<Store> {
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
    const result = await DatabaseService.query<Store>(query, values);
    return result.rows[0];
  }

  public async findStoresByMerchantId(merchantId: string): Promise<Store[]> {
    const query = `
      SELECT id, merchant_id as "merchantId", store_name as "storeName", 
             address_line as "addressLine", city, state, pincode, 
             soundbox_device_id as "soundboxDeviceId", upi_vpa as "upiVpa", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM stores
      WHERE merchant_id = $1
    `;
    const result = await DatabaseService.query<Store>(query, [merchantId]);
    return result.rows;
  }

  public async updatePreferences(
    merchantId: string,
    preferredLanguage: IndicLanguage,
    subscriptionTier: SubscriptionTier
  ): Promise<Merchant | null> {
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
    const result = await DatabaseService.query<Merchant>(query, [preferredLanguage, subscriptionTier, merchantId]);
    return result.rows[0] || null;
  }
}
