"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limiter_middleware_1 = require("../../middleware/rate-limiter.middleware");
const createAuthRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new auth_controller_1.AuthController();
    // Strict rate limit on auth endpoints: max 10 requests per minute per IP
    const strictAuthLimiter = (0, rate_limiter_middleware_1.rateLimiter)({ windowSeconds: 60, maxRequests: 10, keyPrefix: 'ratelimit:auth' });
    router.post('/register', strictAuthLimiter, controller.register);
    router.post('/login', strictAuthLimiter, controller.login);
    router.post('/refresh-token', strictAuthLimiter, controller.refreshToken);
    router.post('/logout', auth_middleware_1.authenticateJwt, controller.logout);
    return router;
};
exports.createAuthRouter = createAuthRouter;
//# sourceMappingURL=auth.routes.js.map