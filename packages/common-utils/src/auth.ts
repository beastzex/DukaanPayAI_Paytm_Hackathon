import jwt from 'jsonwebtoken';
import { AuthClaims, UserRole } from '@dukaanpay/shared-types';
import { UnauthorizedError, ForbiddenError } from './errors';

const JWT_SECRET = process.env.JWT_SECRET || 'dukaanpay-super-secret-production-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dukaanpay-refresh-super-secret-key-2026';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  public static generateTokens(claims: AuthClaims): TokenPair {
    const accessToken = jwt.sign(claims, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: 'dukaanpay-auth',
      audience: 'dukaanpay-services',
    });

    const refreshToken = jwt.sign(
      { userId: claims.userId, phoneNumber: claims.phoneNumber },
      JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        issuer: 'dukaanpay-auth',
        audience: 'dukaanpay-services',
      }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  public static verifyAccessToken(token: string): AuthClaims {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'dukaanpay-auth',
        audience: 'dukaanpay-services',
      }) as AuthClaims;
      return decoded;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token expired');
      }
      throw new UnauthorizedError('Invalid access token');
    }
  }

  public static verifyRefreshToken(token: string): { userId: string; phoneNumber: string } {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'dukaanpay-auth',
        audience: 'dukaanpay-services',
      }) as { userId: string; phoneNumber: string };
      return decoded;
    } catch (err: any) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  public static requireRoles(userRoles: UserRole[], allowedRoles: UserRole[]): void {
    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError(
        `Access denied. Required one of roles: [${allowedRoles.join(', ')}], current roles: [${userRoles.join(', ')}]`
      );
    }
  }
}
