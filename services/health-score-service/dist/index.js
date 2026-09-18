"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const common_utils_1 = require("@dukaanpay/common-utils");
const health_score_routes_1 = require("./routes/health-score.routes");
dotenv_1.default.config();
const logger = (0, common_utils_1.createServiceLogger)('health-score-service');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4004;
app.use(express_1.default.json());
// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP', service: 'health-score-service' });
});
// Routes
app.use('/', (0, health_score_routes_1.createHealthScoreRouter)());
// Error Handler
app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message,
            details: err.details,
        },
    });
});
app.listen(PORT, () => {
    logger.info(`Health Score Service listening on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map