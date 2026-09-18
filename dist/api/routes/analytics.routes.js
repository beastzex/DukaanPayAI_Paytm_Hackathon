"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRouter = void 0;
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const entities_1 = require("../../domain/entities/entities");
const createAnalyticsRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new analytics_controller_1.AnalyticsController();
    router.get('/metrics', auth_middleware_1.authenticateJwt, controller.getMetrics);
    router.get('/audit-logs', auth_middleware_1.authenticateJwt, (0, rbac_middleware_1.authorizeRoles)(entities_1.UserRole.ADMIN, entities_1.UserRole.SUPPORT), controller.getAuditLogs);
    return router;
};
exports.createAnalyticsRouter = createAnalyticsRouter;
//# sourceMappingURL=analytics.routes.js.map