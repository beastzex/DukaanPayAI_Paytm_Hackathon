"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthScoreRouter = void 0;
const express_1 = require("express");
const HealthScoreController_1 = require("../controllers/HealthScoreController");
const createHealthScoreRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new HealthScoreController_1.HealthScoreController();
    router.post('/evaluate', controller.evaluate);
    router.get('/current', controller.getScore);
    router.get('/credit-eligibility', controller.getCredit);
    return router;
};
exports.createHealthScoreRouter = createHealthScoreRouter;
//# sourceMappingURL=health-score.routes.js.map