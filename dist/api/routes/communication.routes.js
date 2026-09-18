"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunicationRouter = void 0;
const express_1 = require("express");
const communication_controller_1 = require("../controllers/communication.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const createCommunicationRouter = () => {
    const router = (0, express_1.Router)();
    const controller = new communication_controller_1.CommunicationController();
    router.post('/whatsapp/send', auth_middleware_1.authenticateJwt, controller.sendWhatsApp);
    router.post('/voice/call', auth_middleware_1.authenticateJwt, controller.initiateCall);
    return router;
};
exports.createCommunicationRouter = createCommunicationRouter;
//# sourceMappingURL=communication.routes.js.map