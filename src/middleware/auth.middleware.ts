import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../configs/env.config';
import { RedisClient } from '../infrastructure/redis/redis-client';
import { UnauthorizedException } from '../domain/exceptions/domain-exceptions';

export interface AuthenticatedUserPayload {
  userId: string;
  merchantId?: string;
  roles: string[];
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
      token?: string;
    }
  }
}

export const authenticateJwt = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token has been revoked in Redis blacklist
    const isBlacklisted = await RedisClient.get(`jwt:blacklist:${token}`);
    if (isBlacklisted) {
      return next(new UnauthorizedException('Token has been revoked/blacklisted. Please log in again.'));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthenticatedUserPayload;
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    next(new UnauthorizedException('Invalid, expired, or corrupted token'));
  }
};
