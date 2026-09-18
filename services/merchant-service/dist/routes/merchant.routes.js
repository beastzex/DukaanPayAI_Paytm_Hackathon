"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMerchantRouter = void 0;
const express_1 = require("express");
const MerchantController_1 = require("../controllers/MerchantController");
const createMerchantRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new MerchantController_1.MerchantController();
    // Public Auth Endpoints
    router.post('/register', controller.register);
    router.post('/login', controller.login);
    router.post('/refresh-token', controller.refreshToken);
    // Merchant Endpoints
    router.get('/:id/profile', controller.getProfile);
    router.patch('/:id/preferences', controller.updatePreferences);
    return router;
};
exports.createMerchantRouter = createMerchantRouter;
//# sourceMappingURL=merchant.routes.js.map