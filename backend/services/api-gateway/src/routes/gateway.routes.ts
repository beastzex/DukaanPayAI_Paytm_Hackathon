import { Router, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticateJwt, authorizeRoles } from '../middleware/auth.middleware';
import { strictAuthRateLimiter } from '../middleware/rate-limiter';
import { UserRole } from '@dukaanpay/shared-types';

export const createGatewayRouter = (): Router => {
  const router = Router();

  // Downstream Service URLs
  const MERCHANT_SERVICE_URL = process.env.MERCHANT_SERVICE_URL || 'http://localhost:4001';
  const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:4002';
  const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4003';
  const HEALTH_SCORE_SERVICE_URL = process.env.HEALTH_SCORE_SERVICE_URL || 'http://localhost:4004';
  const CAMPAIGN_SERVICE_URL = process.env.CAMPAIGN_SERVICE_URL || 'http://localhost:4005';
  const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4006';
  const AI_AGENT_SERVICE_URL = process.env.AI_AGENT_SERVICE_URL || 'http://localhost:8001';
  const FORECASTING_SERVICE_URL = process.env.FORECASTING_SERVICE_URL || 'http://localhost:8002';
  const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8003';
  const VOICE_AGENT_SERVICE_URL = process.env.VOICE_AGENT_SERVICE_URL || 'http://localhost:8004';

  // Helper to re-stream parsed body and attach tracing/auth headers
  const onProxyReq = (proxyReq: any, req: any) => {
    if (req.correlationId) {
      proxyReq.setHeader('x-correlation-id', req.correlationId);
    }
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.userId);
      proxyReq.setHeader('x-user-roles', JSON.stringify(req.user.roles));
      if (req.user.merchantId) {
        proxyReq.setHeader('x-merchant-id', req.user.merchantId);
      }
    }
    // Re-stream JSON body to downstream service
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  };

  // Gateway Health Check
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // 1. Auth & Merchant Routes
  router.use(
    '/api/v1/auth',
    strictAuthRateLimiter,
    createProxyMiddleware({
      target: MERCHANT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/auth': '' },
      onProxyReq,
    })
  );

  router.use(
    '/api/v1/merchants',
    authenticateJwt,
    createProxyMiddleware({
      target: MERCHANT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/merchants': '' },
      onProxyReq,
    })
  );

  // 2. Transaction Telemetry
  router.use(
    '/api/v1/transactions',
    authenticateJwt,
    createProxyMiddleware({
      target: TRANSACTION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/transactions': '' },
      onProxyReq,
    })
  );

  // 3. Inventory Management
  router.use(
    '/api/v1/inventory',
    authenticateJwt,
    createProxyMiddleware({
      target: INVENTORY_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/inventory': '' },
      onProxyReq,
    })
  );

  // 4. Merchant Health Score & Underwriting
  router.use(
    '/api/v1/health-score',
    authenticateJwt,
    createProxyMiddleware({
      target: HEALTH_SCORE_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/health-score': '' },
      onProxyReq,
    })
  );

  router.use(
    '/api/v1/credit',
    authenticateJwt,
    authorizeRoles(UserRole.MERCHANT, UserRole.CREDIT_OFFICER, UserRole.ADMIN),
    createProxyMiddleware({
      target: HEALTH_SCORE_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/credit': '' },
      onProxyReq,
    })
  );

  // 5. Campaigns & WhatsApp Dispatch
  router.use(
    '/api/v1/campaigns',
    authenticateJwt,
    createProxyMiddleware({
      target: CAMPAIGN_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/campaigns': '' },
      onProxyReq,
    })
  );

  // 6. Notifications
  router.use(
    '/api/v1/notifications',
    authenticateJwt,
    createProxyMiddleware({
      target: NOTIFICATION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/v1/notifications': '' },
      onProxyReq,
    })
  );

  // 7. AI Multi-Agent Cognitive Engine (LangGraph)
  router.use(
    '/api/v1/agents',
    authenticateJwt,
    createProxyMiddleware({
      target: AI_AGENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq,
    })
  );

  // 8. Forecasting Engine (Prophet / XGBoost)
  router.use(
    '/api/v1/forecasting',
    authenticateJwt,
    createProxyMiddleware({
      target: FORECASTING_SERVICE_URL,
      changeOrigin: true,
      onProxyReq,
    })
  );

  // 9. OCR & Bill Parsing Service
  router.use(
    '/api/v1/ocr',
    authenticateJwt,
    createProxyMiddleware({
      target: OCR_SERVICE_URL,
      changeOrigin: true,
      onProxyReq,
    })
  );

  // 10. Voice Agent Service (Twilio Webhooks & Indic Audio)
  router.use(
    '/api/v1/voice',
    createProxyMiddleware({
      target: VOICE_AGENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq,
    })
  );

  return router;
};
