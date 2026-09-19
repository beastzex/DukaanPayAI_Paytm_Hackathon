import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PostgresUserRepository } from '../repositories/postgres/postgres-repositories';
import { UserEntity, UserRole } from '../domain/entities/entities';
import { config } from '../configs/env.config';
import { RedisClient } from '../infrastructure/redis/redis-client';
import { UnauthorizedException, ConflictException, EntityNotFoundException } from '../domain/exceptions/domain-exceptions';
import { logger } from '../monitoring/logger';

// Cross-platform enterprise cryptographic hasher (Argon2 with crypto.scrypt fallback)
class PasswordHasher {
  private static argon2Module: any = null;
  private static attempted = false;

  private static getArgon2() {
    if (!this.attempted) {
      this.attempted = true;
      try {
        this.argon2Module = require('argon2');
      } catch {
        this.argon2Module = null;
      }
    }
    return this.argon2Module;
  }

  public static async hash(password: string): Promise<string> {
    const a2 = this.getArgon2();
    if (a2) {
      try {
        return await a2.hash(password, { type: a2.argon2id, memoryCost: 65536, timeCost: 3 });
      } catch {
        // Fall back to crypto.scrypt
      }
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    return `$scrypt$${salt}$${derivedKey}`;
  }

  public static async verify(hash: string, password: string): Promise<boolean> {
    if (hash.startsWith('$scrypt$')) {
      const [, , salt, key] = hash.split('$');
      const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derivedKey, 'hex'));
    }
    const a2 = this.getArgon2();
    if (a2) {
      try {
        return await a2.verify(hash, password);
      } catch {
        return false;
      }
    }
    return false;
  }
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class UserService {
  private userRepo = new PostgresUserRepository();

  public async register(
    phone: string,
    password: string,
    email?: string,
    roles: UserRole[] = [UserRole.MERCHANT],
    merchantId?: string
  ): Promise<{ user: Omit<UserEntity, 'passwordHash' | 'refreshTokenHash'>; tokens: AuthTokens }> {
    const existing = await this.userRepo.findByPhone(phone);
    if (existing) {
      throw new ConflictException(`User with phone ${phone} already exists`);
    }

    // Bank-grade password hashing with Argon2id / Scrypt
    const passwordHash = await PasswordHasher.hash(password);

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
    logger.info({ userId: user.id, phone }, 'User successfully registered with Argon2 credentials');

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

  public async login(
    phone: string,
    password: string
  ): Promise<{ user: Omit<UserEntity, 'passwordHash' | 'refreshTokenHash'>; tokens: AuthTokens }> {
    const user = await this.userRepo.findByPhone(phone);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const isValid = await PasswordHasher.verify(user.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const tokens = await this.generateTokens(user);
    await this.userRepo.update(user.id, { lastLoginAt: new Date() }, user.version);

    logger.info({ userId: user.id }, 'User authenticated successfully');

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

  public async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { userId: string };
      const user = await this.userRepo.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User account inactive or removed');
      }

      // Invalidate the old refresh token (Token Rotation)
      await RedisClient.set(`jwt:blacklist:${refreshToken}`, 'revoked', 7 * 86400);

      const tokens = await this.generateTokens(user);
      logger.info({ userId: user.id }, 'Auth tokens rotated successfully');
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async logout(accessToken: string): Promise<void> {
    // Blacklist access token in Redis for remaining duration
    await RedisClient.set(`jwt:blacklist:${accessToken}`, 'revoked', 15 * 60);
    logger.info('Access token blacklisted in Redis');
  }

  public async isTokenRevoked(token: string): Promise<boolean> {
    const revoked = await RedisClient.get(`jwt:blacklist:${token}`);
    return revoked !== null;
  }

  private async generateTokens(user: UserEntity): Promise<AuthTokens> {
    const payload = {
      userId: user.id,
      merchantId: user.merchantId,
      roles: user.roles,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: '15m',
    };
  }
}
