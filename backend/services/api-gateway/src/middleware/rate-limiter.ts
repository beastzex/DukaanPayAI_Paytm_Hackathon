import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const standardRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please wait a minute.',
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  },
  keyGenerator: (req: Request) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown-client';
  },
});

export const strictAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes for login / OTP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  },
});
