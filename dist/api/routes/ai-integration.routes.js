"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAIIntegrationRouter = void 0;
const express_1 = require("express");
const ai_integration_controller_1 = require("../controllers/ai-integration.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const createAIIntegrationRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new ai_integration_controller_1.AIIntegrationController();
    router.get('/merchant-context/:id', auth_middleware_1.authenticateJwt, controller.getMerchantContext);
    router.post('/recommendations', auth_middleware_1.authenticateJwt, controller.ingestRecommendation);
    return router;
};
exports.createAIIntegrationRouter = createAIIntegrationRouter;
//# sourceMappingURL=ai-integration.routes.js.map