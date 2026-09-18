"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authorizeRoles = void 0;
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new domain_exceptions_1.UnauthorizedException());
        }
        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            return next(new domain_exceptions_1.ForbiddenException(`Requires one of the following roles: [${allowedRoles.join(', ')}]. You hold: [${req.user.roles.join(', ')}]`));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const authorizePermissions = (...requiredPermissions) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new domain_exceptions_1.UnauthorizedException());
        }
        const hasAll = requiredPermissions.every((perm) => req.user?.permissions.includes(perm));
        if (!hasAll) {
            return next(new domain_exceptions_1.ForbiddenException(`Missing required permissions: [${requiredPermissions.join(', ')}]`));
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
//# sourceMappingURL=rbac.middleware.js.map