import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../domain/exceptions/domain-exceptions';
import { logger } from '../monitoring/logger';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const correlationId = req.correlationId || 'unknown';

  // 1. Handled Domain Exceptions
  if (err instanceof DomainException) {
    logger.warn({ correlationId, errorCode: err.errorCode, message: err.message }, 'Handled Domain Exception');
    res.status(err.statusCode).json({
      type: `https://api.dukaanpay.ai/errors/${err.errorCode.toLowerCase()}`,
      title: err.errorCode,
      status: err.statusCode,
      detail: err.message,
      instance: req.originalUrl,
      correlationId,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    logger.warn({ correlationId, issues: err.issues }, 'Schema Validation Error');
    res.status(422).json({
      type: 'https://api.dukaanpay.ai/errors/validation_error',
      title: 'VALIDATION_FAILED',
      status: 422,
      detail: 'The provided request payload failed schema validation.',
      errors: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      instance: req.originalUrl,
      correlationId,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 3. Unhandled Internal Server Errors
  logger.error({ correlationId, error: err.stack || err.message }, 'Unhandled Internal Server Error');
  res.status(500).json({
    type: 'https://api.dukaanpay.ai/errors/internal_server_error',
    title: 'INTERNAL_SERVER_ERROR',
    status: 500,
    detail: 'An unexpected internal server error occurred.',
    instance: req.originalUrl,
    correlationId,
    timestamp: new Date().toISOString(),
  });
};
