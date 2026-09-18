"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictAuthRateLimiter = exports.standardRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.standardRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP. Please wait a minute.',
        },
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        },
    },
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.ip || 'unknown-client';
    },
});
exports.strictAuthRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes for login / OTP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
        },
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        },
    },
});
//# sourceMappingURL=rate-limiter.js.map