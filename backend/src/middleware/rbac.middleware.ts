import { Request, Response, NextFunction } from 'express';
import { ForbiddenException, UnauthorizedException } from '../domain/exceptions/domain-exceptions';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedException());
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(
        new ForbiddenException(
          `Requires one of the following roles: [${allowedRoles.join(', ')}]. You hold: [${req.user.roles.join(', ')}]`
        )
      );
    }

    next();
  };
};

export const authorizePermissions = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedException());
    }

    const hasAll = requiredPermissions.every((perm) => req.user?.permissions.includes(perm));
    if (!hasAll) {
      return next(
        new ForbiddenException(`Missing required permissions: [${requiredPermissions.join(', ')}]`)
      );
    }

    next();
  };
};
