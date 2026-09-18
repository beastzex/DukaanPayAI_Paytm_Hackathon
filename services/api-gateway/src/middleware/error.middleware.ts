import { Request, Response, NextFunction } from 'express';
import { AppError, createServiceLogger } from '@dukaanpay/common-utils';

const logger = createServiceLogger('api-gateway-errors');

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const errorCode = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal error occurred';
  const details = isAppError ? err.details : undefined;

  logger.error(`Error handling request: ${req.method} ${req.originalUrl}`, {
    correlationId: req.correlationId,
    statusCode,
    errorCode,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.correlationId,
      version: '1.0.0',
    },
  });
};
