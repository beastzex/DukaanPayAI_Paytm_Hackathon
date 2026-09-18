"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, json } = winston_1.default.format;
const customFormat = printf(({ level, message, timestamp, service, correlationId, ...meta }) => {
    return `[${timestamp}] [${service || 'service'}] [${correlationId || 'no-trace'}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});
const createServiceLogger = (serviceName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    return winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
        defaultMeta: { service: serviceName },
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), isProduction ? json() : combine(colorize(), customFormat)),
        transports: [
            new winston_1.default.transports.Console(),
            ...(isProduction
                ? [
                    new winston_1.default.transports.File({ filename: `logs/${serviceName}-error.log`, level: 'error' }),
                    new winston_1.default.transports.File({ filename: `logs/${serviceName}-combined.log` }),
                ]
                : []),
        ],
    });
};
exports.createServiceLogger = createServiceLogger;
//# sourceMappingURL=logger.js.map