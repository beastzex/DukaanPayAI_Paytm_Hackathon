"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignRouter = void 0;
const express_1 = require("express");
const CampaignController_1 = require("../controllers/CampaignController");
const createCampaignRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new CampaignController_1.CampaignController();
    router.post('/draft', controller.draft);
    router.post('/approve', controller.approve);
    router.get('/history', controller.getCampaigns);
    return router;
};
exports.createCampaignRouter = createCampaignRouter;
//# sourceMappingURL=campaign.routes.js.map