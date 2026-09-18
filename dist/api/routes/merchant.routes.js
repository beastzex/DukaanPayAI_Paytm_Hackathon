"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMerchantRouter = void 0;
const express_1 = require("express");
const merchant_controller_1 = require("../controllers/merchant.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const entities_1 = require("../../domain/entities/entities");
const createMerchantRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new merchant_controller_1.MerchantController();
    router.get('/:id', auth_middleware_1.authenticateJwt, controller.getProfile);
    router.get('/:id/profile', auth_middleware_1.authenticateJwt, controller.getProfile);
    router.post('/', controller.register);
    router.post('/register', controller.register);
    router.patch('/:id/settings', auth_middleware_1.authenticateJwt, (0, rbac_middleware_1.authorizeRoles)(entities_1.UserRole.MERCHANT, entities_1.UserRole.ADMIN), controller.updateSettings);
    return router;
};
exports.createMerchantRouter = createMerchantRouter;
//# sourceMappingURL=merchant.routes.js.map