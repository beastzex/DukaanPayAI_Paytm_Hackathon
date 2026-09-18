"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = void 0;
const uuid_1 = require("uuid");
const correlationMiddleware = (req, res, next) => {
    const incomingId = req.headers['x-correlation-id'] || req.headers['x-request-id'];
    const correlationId = incomingId || `corr_${(0, uuid_1.v4)()}`;
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
};
exports.correlationMiddleware = correlationMiddleware;
//# sourceMappingURL=correlation.middleware.js.map