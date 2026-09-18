"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postgres_repositories_1 = require("../repositories/postgres/postgres-repositories");
const entities_1 = require("../domain/entities/entities");
const env_config_1 = require("../configs/env.config");
const redis_client_1 = require("../infrastructure/redis/redis-client");
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const logger_1 = require("../monitoring/logger");
class UserService {
    userRepo = new postgres_repositories_1.PostgresUserRepository();
    async register(phone, password, email, roles = [entities_1.UserRole.MERCHANT], merchantId) {
        const existing = await this.userRepo.findByPhone(phone);
        if (existing) {
            throw new domain_exceptions_1.ConflictException(`User with phone ${phone} already exists`);
        }
        // Bank-grade password hashing with Argon2id
        const passwordHash = await argon2_1.default.hash(password, {
            type: argon2_1.default.argon2id,
            memoryCost: 65536,
            timeCost: 3,
        });
        const user = await this.userRepo.create({
            phoneNumber: phone,
            email,
            passwordHash,
            roles,
            permissions: ['READ_PROFILE', 'MANAGE_INVENTORY', 'DISPATCH_CAMPAIGNS'],
            isActive: true,
            merchantId,
        });
        const tokens = await this.generateTokens(user);
        logger_1.logger.info({ userId: user.id, phone }, 'User successfully registered with Argon2 credentials');
        return {
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                email: user.email,
                roles: user.roles,
                permissions: user.permissions,
                isActive: user.isActive,
                merchantId: user.merchantId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
                version: user.version,
            },
            tokens,
        };
    }
    async login(phone, password) {
        const user = await this.userRepo.findByPhone(phone);
        if (!user || !user.isActive) {
            throw new domain_exceptions_1.UnauthorizedException('Invalid phone number or password');
        }
        const isValid = await argon2_1.default.verify(user.passwordHash, password);
        if (!isValid) {
            throw new domain_exceptions_1.UnauthorizedException('Invalid phone number or password');
        }
        const tokens = await this.generateTokens(user);
        await this.userRepo.update(user.id, { lastLoginAt: new Date() }, user.version);
        logger_1.logger.info({ userId: user.id }, 'User authenticated successfully');
        return {
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                email: user.email,
                roles: user.roles,
                permissions: user.permissions,
                isActive: user.isActive,
                merchantId: user.merchantId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
                version: user.version,
            },
            tokens,
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_config_1.config.JWT_REFRESH_SECRET);
            const user = await this.userRepo.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new domain_exceptions_1.UnauthorizedException('User account inactive or removed');
            }
            // Invalidate the old refresh token (Token Rotation)
            await redis_client_1.RedisClient.set(`jwt:blacklist:${refreshToken}`, 'revoked', 7 * 86400);
            const tokens = await this.generateTokens(user);
            logger_1.logger.info({ userId: user.id }, 'Auth tokens rotated successfully');
            return tokens;
        }
        catch {
            throw new domain_exceptions_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(accessToken) {
        // Blacklist access token in Redis for remaining duration
        await redis_client_1.RedisClient.set(`jwt:blacklist:${accessToken}`, 'revoked', 15 * 60);
        logger_1.logger.info('Access token blacklisted in Redis');
    }
    async isTokenRevoked(token) {
        const revoked = await redis_client_1.RedisClient.get(`jwt:blacklist:${token}`);
        return revoked !== null;
    }
    async generateTokens(user) {
        const payload = {
            userId: user.id,
            merchantId: user.merchantId,
            roles: user.roles,
            permissions: user.permissions,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, env_config_1.config.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            expiresIn: '15m',
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map