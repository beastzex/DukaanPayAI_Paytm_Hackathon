"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const common_utils_1 = require("@dukaanpay/common-utils");
const logger = (0, common_utils_1.createServiceLogger)('api-gateway-errors');
const errorMiddleware = (err, req, res, _next) => {
    const isAppError = err instanceof common_utils_1.AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    const errorCode = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'An unexpected internal error occurred';
    const details = isAppError ? err.details : undefined;
    logger.error(`Error handling request: ${req.method} ${req.originalUrl}`, {
        correlationId: req.correlationId,
        statusCode,
        errorCode,
        message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
    res.status(statusCode).json({
        success: false,
        data: null,
        error: {
            code: errorCode,
            message,
            ...(details ? { details } : {}),
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId: req.correlationId,
            version: '1.0.0',
        },
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map