import express, { Application, Request, Response } from 'express';
import { securityHeaders, corsPolicy, inputSanitizer } from './middleware/security.middleware';
import { idempotencyMiddleware } from './middleware/idempotency.middleware';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { livenessHandler, readinessHandler } from './monitoring/health';
import { metricsRegistry, httpRequestDurationMicroseconds, httpRequestsTotal } from './monitoring/metrics';
import { createAuthRouter } from './api/routes/auth.routes';
import { createMerchantRouter } from './api/routes/merchant.routes';
import { createCommunicationRouter } from './api/routes/communication.routes';
import { createCampaignRouter } from './api/routes/campaign.routes';
import { createAIIntegrationRouter } from './api/routes/ai-integration.routes';
import { createWebhookRouter } from './api/routes/webhook.routes';
import { createAnalyticsRouter } from './api/routes/analytics.routes';
import { QueueManager } from './workers/queue-manager';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Perimeter Security & Hygiene
  app.use(securityHeaders);
  app.use(corsPolicy);
  app.use(correlationMiddleware);

  // 2. Body Parsers & Sanitization
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(inputSanitizer);
  app.use(idempotencyMiddleware());

  // 3. Observability & Telemetry Middleware
  app.use((req: Request, res: Response, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;
      httpRequestDurationMicroseconds.observe(
        { method: req.method, route, status_code: res.statusCode },
        duration
      );
      httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
    });
    next();
  });

  // 4. Infrastructure Health & Metrics Endpoints
  app.get('/health/live', livenessHandler);
  app.get('/health/ready', readinessHandler);
  app.get('/health', livenessHandler); // Standard root health
  app.get('/health/queues', async (_req, res) => {
    const queueMetrics = await QueueManager.getQueueMetrics();
    res.status(200).json({ status: 'UP', queues: queueMetrics });
  });
  app.get('/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', metricsRegistry.contentType);
    res.send(await metricsRegistry.metrics());
  });

  // 4.1 Interactive API Documentation (/docs) & OpenAPI Spec
  const openApiPath = [
    path.join(__dirname, 'api/docs/openapi.yaml'),
    path.join(__dirname, '../src/api/docs/openapi.yaml'),
    path.join(process.cwd(), 'src/api/docs/openapi.yaml'),
  ].find((p) => fs.existsSync(p));

  if (openApiPath) {
    try {
      const swaggerDoc = YAML.load(openApiPath);
      app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDoc, {
          customSiteTitle: 'DukaanPayAI Backend Platform - Interactive API Docs',
          customCss: '.swagger-ui .topbar { display: none }',
        })
      );
      app.get('/openapi.yaml', (_req, res) => {
        res.setHeader('Content-Type', 'text/yaml');
        res.sendFile(openApiPath);
      });
      app.get('/openapi.json', (_req, res) => {
        res.json(swaggerDoc);
      });
    } catch {
      // ignore
    }
  }

  // 5. Core Domain Route Mounts (API-First Design)
  app.use('/api/v1/auth', createAuthRouter());
  app.use('/api/v1/merchants', createMerchantRouter());
  app.use('/api/v1/communications', createCommunicationRouter());
  app.use('/api/v1/campaigns', createCampaignRouter());
  app.use('/api/v1/ai-integration', createAIIntegrationRouter());
  app.use('/api/v1/webhooks', createWebhookRouter());
  app.use('/api/v1/analytics', createAnalyticsRouter());

  // 6. Global RFC 7807 Error Handling Middleware
  app.use(errorMiddleware);

  return app;
};
