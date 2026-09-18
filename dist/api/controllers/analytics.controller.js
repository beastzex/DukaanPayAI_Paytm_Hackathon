"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../../services/analytics.service");
class AnalyticsController {
    analyticsService = new analytics_service_1.AnalyticsService();
    getMetrics = async (req, res, next) => {
        try {
            const metrics = await this.analyticsService.getPlatformMetrics();
            res.status(200).json({
                success: true,
                data: metrics,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    getAuditLogs = async (req, res, next) => {
        try {
            const actorId = req.query.actorId || req.user?.userId || 'system';
            const logs = await this.analyticsService.getAuditLogs(actorId);
            res.status(200).json({
                success: true,
                data: logs,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map