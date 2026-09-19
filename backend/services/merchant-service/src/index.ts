import express from 'express';
import dotenv from 'dotenv';
import { createServiceLogger } from '@dukaanpay/common-utils';
import { createMerchantRouter } from './routes/merchant.routes';

dotenv.config();

const logger = createServiceLogger('merchant-service');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', service: 'merchant-service' });
});

// Routes
app.use('/', createMerchantRouter());

// Error handler
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

app.listen(PORT, () => {
  logger.info(`Merchant Service listening on port ${PORT}`);
});

export default app;
