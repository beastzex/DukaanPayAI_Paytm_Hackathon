"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = void 0;
const crypto_1 = require("crypto");
const correlationMiddleware = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || `corr_${(0, crypto_1.randomUUID)()}`;
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
};
exports.correlationMiddleware = correlationMiddleware;
//# sourceMappingURL=correlation.middleware.js.map