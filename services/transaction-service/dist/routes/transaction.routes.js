"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionRouter = void 0;
const express_1 = require("express");
const TransactionController_1 = require("../controllers/TransactionController");
const createTransactionRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new TransactionController_1.TransactionController();
    router.post('/ingest', controller.ingest);
    router.get('/analytics/velocity', controller.getVelocity);
    router.get('/analytics/footfall-hourly', controller.getHourlyDistribution);
    router.get('/analytics/lost-revenue', controller.getLostRevenue);
    router.get('/analytics/market-benchmark', controller.getMarketBenchmark);
    router.get('/history', controller.getHistory);
    return router;
};
exports.createTransactionRouter = createTransactionRouter;
//# sourceMappingURL=transaction.routes.js.map