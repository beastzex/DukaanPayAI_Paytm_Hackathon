"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryRouter = void 0;
const express_1 = require("express");
const InventoryController_1 = require("../controllers/InventoryController");
const createInventoryRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new InventoryController_1.InventoryController();
    router.post('/skus', controller.createSKU);
    router.post('/update-stock', controller.updateStock);
    router.get('/status', controller.getStatus);
    router.get('/alerts/low-stock', controller.getLowStockAlerts);
    return router;
};
exports.createInventoryRouter = createInventoryRouter;
//# sourceMappingURL=inventory.routes.js.map