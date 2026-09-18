"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScopedLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_config_1 = require("../configs/env.config");
exports.logger = (0, pino_1.default)({
    level: env_config_1.config.LOG_LEVEL,
    formatters: {
        level: (label) => ({ level: label }),
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    transport: env_config_1.config.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});
const createScopedLogger = (scope) => {
    return exports.logger.child({ scope });
};
exports.createScopedLogger = createScopedLogger;
//# sourceMappingURL=logger.js.map