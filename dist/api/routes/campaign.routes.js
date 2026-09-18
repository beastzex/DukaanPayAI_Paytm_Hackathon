"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignRouter = void 0;
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const createCampaignRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new campaign_controller_1.CampaignController();
    router.post('/', auth_middleware_1.authenticateJwt, controller.create);
    router.post('/:id/execute', auth_middleware_1.authenticateJwt, controller.execute);
    router.get('/merchant/:merchantId', auth_middleware_1.authenticateJwt, controller.listByMerchant);
    return router;
};
exports.createCampaignRouter = createCampaignRouter;
//# sourceMappingURL=campaign.routes.js.map