"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("./errors");
const JWT_SECRET = process.env.JWT_SECRET || 'dukaanpay-super-secret-production-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dukaanpay-refresh-super-secret-key-2026';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
class AuthService {
    static generateTokens(claims) {
        const accessToken = jsonwebtoken_1.default.sign(claims, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
            issuer: 'dukaanpay-auth',
            audience: 'dukaanpay-services',
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: claims.userId, phoneNumber: claims.phoneNumber }, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
            issuer: 'dukaanpay-auth',
            audience: 'dukaanpay-services',
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
        };
    }
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
                issuer: 'dukaanpay-auth',
                audience: 'dukaanpay-services',
            });
            return decoded;
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new errors_1.UnauthorizedError('Access token expired');
            }
            throw new errors_1.UnauthorizedError('Invalid access token');
        }
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
                issuer: 'dukaanpay-auth',
                audience: 'dukaanpay-services',
            });
            return decoded;
        }
        catch (err) {
            throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
    }
    static requireRoles(userRoles, allowedRoles) {
        const hasRole = userRoles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            throw new errors_1.ForbiddenError(`Access denied. Required one of roles: [${allowedRoles.join(', ')}], current roles: [${userRoles.join(', ')}]`);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map