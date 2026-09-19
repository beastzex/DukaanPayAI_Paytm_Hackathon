import express from 'express';
import dotenv from 'dotenv';
import { createServiceLogger } from '@dukaanpay/common-utils';
import { createNotificationRouter } from './routes/notification.routes';
import { NotificationService } from './services/NotificationService';

dotenv.config();

const logger = createServiceLogger('notification-service');
const app = express();
const PORT = process.env.PORT || 4006;

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

// Routes
app.use('/', createNotificationRouter());

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      details: err.details,
    },
  });
});

const service = new NotificationService();
service.startConsumers().catch((err) => {
  logger.warn('Failed to start Notification Kafka consumers on init', { error: err.message });
});

app.listen(PORT, () => {
  logger.info(`Notification Service listening on port ${PORT}`);
});

export default app;
