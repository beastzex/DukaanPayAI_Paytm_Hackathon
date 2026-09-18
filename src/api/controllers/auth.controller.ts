import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user.service';
import { z } from 'zod';

const registerSchema = z.object({
  phoneNumber: z.string().min(10),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  email: z.string().email().optional(),
  merchantId: z.string().uuid().optional(),
});

const loginSchema = z.object({
  phoneNumber: z.string().min(10),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export class AuthController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.userService.register(
        data.phoneNumber,
        data.password,
        data.email,
        undefined,
        data.merchantId
      );

      res.status(201).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.userService.login(data.phoneNumber, data.password);

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = refreshSchema.parse(req.body);
      const tokens = await this.userService.refreshTokens(data.refreshToken);

      res.status(200).json({
        success: true,
        data: { tokens },
        meta: { timestamp: new Date().toISOString(), correlationId: req.correlationId },
      });
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (err) {
      next(err);
    }
  };
}
