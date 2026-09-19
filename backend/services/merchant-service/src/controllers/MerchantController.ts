import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../services/MerchantService';
import {
  RegisterMerchantSchema,
  LoginMerchantSchema,
  RefreshTokenSchema,
} from '@dukaanpay/shared-validators';
import { AuthService, ValidationError } from '@dukaanpay/common-utils';
import { ApiResponse, IndicLanguage, SubscriptionTier, UserRole } from '@dukaanpay/shared-types';

export class MerchantController {
  private service: MerchantService;

  constructor() {
    this.service = new MerchantService();
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RegisterMerchantSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed for registration', parsed.error.format());
      }

      const result = await this.service.registerMerchant(
        parsed.data,
        req.headers['x-correlation-id'] as string
      );

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = LoginMerchantSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid phone or OTP format', parsed.error.format());
      }

      const result = await this.service.loginWithOtp(parsed.data.phoneNumber, parsed.data.otp);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RefreshTokenSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Refresh token required', parsed.error.format());
      }

      const decoded = AuthService.verifyRefreshToken(parsed.data.refreshToken);
      const profile = await this.service.getProfile(decoded.userId);

      const tokens = AuthService.generateTokens({
        userId: profile.merchant.id,
        merchantId: profile.merchant.id,
        phoneNumber: profile.merchant.phoneNumber,
        roles: [UserRole.MERCHANT],
        preferredLanguage: profile.merchant.preferredLanguage,
      });

      res.status(200).json({
        success: true,
        data: { tokens },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.id || (req.headers['x-merchant-id'] as string);
      const result = await this.service.getProfile(merchantId);

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.id || (req.headers['x-merchant-id'] as string);
      const { preferredLanguage, subscriptionTier } = req.body;

      const result = await this.service.updatePreferences(
        merchantId,
        preferredLanguage as IndicLanguage,
        subscriptionTier as SubscriptionTier,
        req.headers['x-correlation-id'] as string
      );

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'local',
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
