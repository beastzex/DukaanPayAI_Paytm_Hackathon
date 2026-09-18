"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../../services/user.service");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().min(10),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    email: zod_1.z.string().email().optional(),
    merchantId: zod_1.z.string().uuid().optional(),
});
const loginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().min(10),
    password: zod_1.z.string().min(1),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
class AuthController {
    userService = new user_service_1.UserService();
    register = async (req, res, next) => {
        try {
            const data = registerSchema.parse(req.body);
            const result = await this.userService.register(data.phoneNumber, data.password, data.email, undefined, data.merchantId);
            res.status(201).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    login = async (req, res, next) => {
        try {
            const data = loginSchema.parse(req.body);
            const result = await this.userService.login(data.phoneNumber, data.password);
            res.status(200).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const data = refreshSchema.parse(req.body);
            const tokens = await this.userService.refreshTokens(data.refreshToken);
            res.status(200).json({
                success: true,
                data: { tokens },
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
    logout = async (req, res, next) => {
        try {
            const token = req.token;
            if (token) {
                await this.userService.logout(token);
            }
            res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully. Token revoked.' },
                meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map