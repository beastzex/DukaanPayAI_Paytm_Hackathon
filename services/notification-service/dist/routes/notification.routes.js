"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationRouter = void 0;
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const createNotificationRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new NotificationController_1.NotificationController();
    router.post('/whatsapp/send', controller.sendWhatsApp);
    router.post('/voice/trigger', controller.triggerVoice);
    return router;
};
exports.createNotificationRouter = createNotificationRouter;
//# sourceMappingURL=notification.routes.js.map