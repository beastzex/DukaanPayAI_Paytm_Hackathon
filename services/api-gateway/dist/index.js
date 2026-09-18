"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const common_utils_1 = require("@dukaanpay/common-utils");
const correlation_middleware_1 = require("./middleware/correlation.middleware");
const rate_limiter_1 = require("./middleware/rate-limiter");
const error_middleware_1 = require("./middleware/error.middleware");
const gateway_routes_1 = require("./routes/gateway.routes");
dotenv_1.default.config();
const logger = (0, common_utils_1.createServiceLogger)('api-gateway');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Security Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-soundbox-device-id'],
    credentials: true,
}));
// Global Middlewares
app.use(correlation_middleware_1.correlationMiddleware);
app.use(rate_limiter_1.standardRateLimiter);
// Note: Body parsers should only parse when not streaming raw payloads to proxy targets
// However, proxy handles stream automatically if body parser is applied specifically or selectively
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logging
app.use((req, _res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`, {
        correlationId: req.correlationId,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});
// Gateway Routes
app.use((0, gateway_routes_1.createGatewayRouter)());
// Global Error Handler
app.use(error_middleware_1.errorMiddleware);
const server = app.listen(PORT, () => {
    logger.info(`🚀 API Gateway active and listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Gracefully shutting down API Gateway...');
    server.close(() => {
        logger.info('API Gateway closed.');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map