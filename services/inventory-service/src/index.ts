import express from 'express';
import dotenv from 'dotenv';
import { createServiceLogger } from '@dukaanpay/common-utils';
import { createInventoryRouter } from './routes/inventory.routes';
import { InventoryEventBus } from './kafka/InventoryEventBus';

dotenv.config();

const logger = createServiceLogger('inventory-service');
const app = express();
const PORT = process.env.PORT || 4003;

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', service: 'inventory-service' });
});

// Routes
app.use('/', createInventoryRouter());

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

const eventBus = new InventoryEventBus();
eventBus.startConsumers().catch((err) => {
  logger.warn('Failed to start Inventory Kafka consumers on init', { error: err.message });
});

app.listen(PORT, () => {
  logger.info(`Inventory Service listening on port ${PORT}`);
});

export default app;
