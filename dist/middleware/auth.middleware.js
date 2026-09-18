"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../configs/env.config");
const redis_client_1 = require("../infrastructure/redis/redis-client");
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const authenticateJwt = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new domain_exceptions_1.UnauthorizedException('Missing or malformed Authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        // Check if token has been revoked in Redis blacklist
        const isBlacklisted = await redis_client_1.RedisClient.get(`jwt:blacklist:${token}`);
        if (isBlacklisted) {
            return next(new domain_exceptions_1.UnauthorizedException('Token has been revoked/blacklisted. Please log in again.'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.config.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    }
    catch (err) {
        next(new domain_exceptions_1.UnauthorizedException('Invalid, expired, or corrupted token'));
    }
};
exports.authenticateJwt = authenticateJwt;
//# sourceMappingURL=auth.middleware.js.map