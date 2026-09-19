import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServiceLogger } from '@dukaanpay/common-utils';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { standardRateLimiter } from './middleware/rate-limiter';
import { errorMiddleware } from './middleware/error.middleware';
import { createGatewayRouter } from './routes/gateway.routes';

dotenv.config();

const logger = createServiceLogger('api-gateway');
const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-soundbox-device-id'],
  credentials: true,
}));

// Global Middlewares
app.use(correlationMiddleware);
app.use(standardRateLimiter);

// Note: Body parsers should only parse when not streaming raw payloads to proxy targets
// However, proxy handles stream automatically if body parser is applied specifically or selectively
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, _res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`, {
    correlationId: req.correlationId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Gateway Routes
app.use(createGatewayRouter());

// Global Error Handler
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  logger.info(`🚀 API Gateway active and listening on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Gracefully shutting down API Gateway...');
  server.close(() => {
    logger.info('API Gateway closed.');
    process.exit(0);
  });
});

export default app;
