import express from 'express';
import dotenv from 'dotenv';
import { createServiceLogger } from '@dukaanpay/common-utils';
import { createTransactionRouter } from './routes/transaction.routes';

dotenv.config();

const logger = createServiceLogger('transaction-service');
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', service: 'transaction-service' });
});

// Routes
app.use('/', createTransactionRouter());

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

app.listen(PORT, () => {
  logger.info(`Transaction Service listening on port ${PORT}`);
});

export default app;
