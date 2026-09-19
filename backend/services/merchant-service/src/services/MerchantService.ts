import { MerchantRepository } from '../repositories/MerchantRepository';
import { MerchantProducer } from '../kafka/MerchantProducer';
import { RegisterMerchantInput } from '@dukaanpay/shared-validators';
import { AuthService, ConflictError, NotFoundError, TokenPair } from '@dukaanpay/common-utils';
import { Merchant, Store, UserRole, IndicLanguage, SubscriptionTier } from '@dukaanpay/shared-types';

export class MerchantService {
  private merchantRepo: MerchantRepository;
  private producer: MerchantProducer;

  constructor() {
    this.merchantRepo = new MerchantRepository();
    this.producer = new MerchantProducer();
  }

  public async registerMerchant(
    input: RegisterMerchantInput,
    correlationId = 'reg-init'
  ): Promise<{ merchant: Merchant; store: Store; tokens: TokenPair }> {
    const existing = await this.merchantRepo.findByPhoneNumber(input.phoneNumber);
    if (existing) {
      throw new ConflictError('A merchant with this mobile number already exists');
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
    const tokens = AuthService.generateTokens({
      userId: merchant.id,
      merchantId: merchant.id,
      phoneNumber: merchant.phoneNumber,
      roles: [UserRole.MERCHANT],
      preferredLanguage: merchant.preferredLanguage,
    });

    // Publish event to Kafka
    await this.producer.publishMerchantCreated(merchant, correlationId);

    return { merchant, store, tokens };
  }

  public async loginWithOtp(
    phoneNumber: string,
    otp: string
  ): Promise<{ merchant: Merchant; tokens: TokenPair }> {
    // In production, verify OTP via SMS Gateway (e.g. Gupshup/Twilio).
    // For test/hackathon credentials, OTP '123456' or valid 6-digit is accepted.
    if (otp !== '123456' && process.env.NODE_ENV === 'production') {
      throw new ConflictError('Invalid OTP entered');
    }

    const merchant = await this.merchantRepo.findByPhoneNumber(phoneNumber);
    if (!merchant) {
      throw new NotFoundError('Merchant account');
    }

    const tokens = AuthService.generateTokens({
      userId: merchant.id,
      merchantId: merchant.id,
      phoneNumber: merchant.phoneNumber,
      roles: [UserRole.MERCHANT],
      preferredLanguage: merchant.preferredLanguage,
    });

    return { merchant, tokens };
  }

  public async getProfile(merchantId: string): Promise<{ merchant: Merchant; stores: Store[] }> {
    const merchant = await this.merchantRepo.findById(merchantId);
    if (!merchant) {
      throw new NotFoundError('Merchant');
    }
    const stores = await this.merchantRepo.findStoresByMerchantId(merchantId);
    return { merchant, stores };
  }

  public async updatePreferences(
    merchantId: string,
    language: IndicLanguage,
    tier: SubscriptionTier,
    correlationId = 'pref-update'
  ): Promise<Merchant> {
    const updated = await this.merchantRepo.updatePreferences(merchantId, language, tier);
    if (!updated) {
      throw new NotFoundError('Merchant');
    }
    await this.producer.publishMerchantUpdated(updated, correlationId);
    return updated;
  }
}
