"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const common_utils_1 = require("@dukaanpay/common-utils");
const inventory_routes_1 = require("./routes/inventory.routes");
const InventoryEventBus_1 = require("./kafka/InventoryEventBus");
dotenv_1.default.config();
const logger = (0, common_utils_1.createServiceLogger)('inventory-service');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4003;
app.use(express_1.default.json());
// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP', service: 'inventory-service' });
});
// Routes
app.use('/', (0, inventory_routes_1.createInventoryRouter)());
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
const eventBus = new InventoryEventBus_1.InventoryEventBus();
eventBus.startConsumers().catch((err) => {
    logger.warn('Failed to start Inventory Kafka consumers on init', { error: err.message });
});
app.listen(PORT, () => {
    logger.info(`Inventory Service listening on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map