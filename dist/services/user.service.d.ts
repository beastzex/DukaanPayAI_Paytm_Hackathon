import { UserEntity, UserRole } from '../domain/entities/entities';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}
export declare class UserService {
    private userRepo;
    register(phone: string, password: string, email?: string, roles?: UserRole[], merchantId?: string): Promise<{
        user: Omit<UserEntity, 'passwordHash' | 'refreshTokenHash'>;
        tokens: AuthTokens;
    }>;
    login(phone: string, password: string): Promise<{
        user: Omit<UserEntity, 'passwordHash' | 'refreshTokenHash'>;
        tokens: AuthTokens;
    }>;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    logout(accessToken: string): Promise<void>;
    isTokenRevoked(token: string): Promise<boolean>;
    private generateTokens;
}
//# sourceMappingURL=user.service.d.ts.map