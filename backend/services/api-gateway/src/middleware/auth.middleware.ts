import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@dukaanpay/common-utils';
import { AuthClaims, UserRole } from '@dukaanpay/shared-types';
import { UnauthorizedError } from '@dukaanpay/common-utils';

declare global {
  namespace Express {
    interface Request {
      user?: AuthClaims;
    }
  }
}

export const authenticateJwt = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const claims = AuthService.verifyAccessToken(token);
    req.user = claims;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User unauthenticated'));
    }
    try {
      AuthService.requireRoles(req.user.roles, allowedRoles);
      next();
    } catch (error) {
      next(error);
    }
  };
};
