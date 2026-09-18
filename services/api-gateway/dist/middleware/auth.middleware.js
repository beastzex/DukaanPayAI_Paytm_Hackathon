"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateJwt = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const common_utils_2 = require("@dukaanpay/common-utils");
const authenticateJwt = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new common_utils_2.UnauthorizedError('Missing or malformed Authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const claims = common_utils_1.AuthService.verifyAccessToken(token);
        req.user = claims;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateJwt = authenticateJwt;
const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new common_utils_2.UnauthorizedError('User unauthenticated'));
        }
        try {
            common_utils_1.AuthService.requireRoles(req.user.roles, allowedRoles);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.middleware.js.map