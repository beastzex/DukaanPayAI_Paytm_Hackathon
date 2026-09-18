import { AuthClaims, UserRole } from '@dukaanpay/shared-types';
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class AuthService {
    static generateTokens(claims: AuthClaims): TokenPair;
    static verifyAccessToken(token: string): AuthClaims;
    static verifyRefreshToken(token: string): {
        userId: string;
        phoneNumber: string;
    };
    static requireRoles(userRoles: UserRole[], allowedRoles: UserRole[]): void;
}
//# sourceMappingURL=auth.d.ts.map