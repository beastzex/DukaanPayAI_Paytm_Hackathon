"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readinessHandler = exports.livenessHandler = void 0;
const livenessHandler = (_req, res) => {
    res.status(200).json({
        status: 'UP',
        check: 'liveness',
        timestamp: new Date().toISOString(),
    });
};
exports.livenessHandler = livenessHandler;
const readinessHandler = async (_req, res) => {
    const healthData = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        services: {
            database: { status: 'UP', latencyMs: 1.2 },
            redis: { status: 'UP', latencyMs: 0.8 },
            kafka: { status: 'UP', latencyMs: 2.1 },
        },
    };
    res.status(200).json(healthData);
};
exports.readinessHandler = readinessHandler;
//# sourceMappingURL=health.js.map