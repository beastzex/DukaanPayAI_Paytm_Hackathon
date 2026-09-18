"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const domain_exceptions_1 = require("../domain/exceptions/domain-exceptions");
const logger_1 = require("../monitoring/logger");
const zod_1 = require("zod");
const errorMiddleware = (err, req, res, _next) => {
    const correlationId = req.correlationId || 'unknown';
    // 1. Handled Domain Exceptions
    if (err instanceof domain_exceptions_1.DomainException) {
        logger_1.logger.warn({ correlationId, errorCode: err.errorCode, message: err.message }, 'Handled Domain Exception');
        res.status(err.statusCode).json({
            type: `https://api.dukaanpay.ai/errors/${err.errorCode.toLowerCase()}`,
            title: err.errorCode,
            status: err.statusCode,
            detail: err.message,
            instance: req.originalUrl,
            correlationId,
            timestamp: new Date().toISOString(),
        });
        return;
    }
    // 2. Zod Validation Errors
    if (err instanceof zod_1.ZodError) {
        logger_1.logger.warn({ correlationId, issues: err.issues }, 'Schema Validation Error');
        res.status(422).json({
            type: 'https://api.dukaanpay.ai/errors/validation_error',
            title: 'VALIDATION_FAILED',
            status: 422,
            detail: 'The provided request payload failed schema validation.',
            errors: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
            instance: req.originalUrl,
            correlationId,
            timestamp: new Date().toISOString(),
        });
        return;
    }
    // 3. Unhandled Internal Server Errors
    logger_1.logger.error({ correlationId, error: err.stack || err.message }, 'Unhandled Internal Server Error');
    res.status(500).json({
        type: 'https://api.dukaanpay.ai/errors/internal_server_error',
        title: 'INTERNAL_SERVER_ERROR',
        status: 500,
        detail: 'An unexpected internal server error occurred.',
        instance: req.originalUrl,
        correlationId,
        timestamp: new Date().toISOString(),
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map