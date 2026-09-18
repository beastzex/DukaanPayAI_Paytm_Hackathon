"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const security_middleware_1 = require("./middleware/security.middleware");
const idempotency_middleware_1 = require("./middleware/idempotency.middleware");
const correlation_middleware_1 = require("./middleware/correlation.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const health_1 = require("./monitoring/health");
const metrics_1 = require("./monitoring/metrics");
const auth_routes_1 = require("./api/routes/auth.routes");
const merchant_routes_1 = require("./api/routes/merchant.routes");
const communication_routes_1 = require("./api/routes/communication.routes");
const campaign_routes_1 = require("./api/routes/campaign.routes");
const ai_integration_routes_1 = require("./api/routes/ai-integration.routes");
const webhook_routes_1 = require("./api/routes/webhook.routes");
const analytics_routes_1 = require("./api/routes/analytics.routes");
const queue_manager_1 = require("./workers/queue-manager");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createApp = () => {
    const app = (0, express_1.default)();
    // 1. Perimeter Security & Hygiene
    app.use(security_middleware_1.securityHeaders);
    app.use(security_middleware_1.corsPolicy);
    app.use(correlation_middleware_1.correlationMiddleware);
    // 2. Body Parsers & Sanitization
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(security_middleware_1.inputSanitizer);
    app.use((0, idempotency_middleware_1.idempotencyMiddleware)());
    // 3. Observability & Telemetry Middleware
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = (Date.now() - start) / 1000;
            const route = req.route?.path || req.path;
            metrics_1.httpRequestDurationMicroseconds.observe({ method: req.method, route, status_code: res.statusCode }, duration);
            metrics_1.httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
        });
        next();
    });
    // 4. Infrastructure Health & Metrics Endpoints
    app.get('/health/live', health_1.livenessHandler);
    app.get('/health/ready', health_1.readinessHandler);
    app.get('/health', health_1.livenessHandler); // Standard root health
    app.get('/health/queues', async (_req, res) => {
        const queueMetrics = await queue_manager_1.QueueManager.getQueueMetrics();
        res.status(200).json({ status: 'UP', queues: queueMetrics });
    });
    app.get('/metrics', async (_req, res) => {
        res.setHeader('Content-Type', metrics_1.metricsRegistry.contentType);
        res.send(await metrics_1.metricsRegistry.metrics());
    });
    // 4.1 Interactive API Documentation (/docs) & OpenAPI Spec
    const openApiPath = [
        path_1.default.join(__dirname, 'api/docs/openapi.yaml'),
        path_1.default.join(__dirname, '../src/api/docs/openapi.yaml'),
        path_1.default.join(process.cwd(), 'src/api/docs/openapi.yaml'),
    ].find((p) => fs_1.default.existsSync(p));
    if (openApiPath) {
        try {
            const swaggerDoc = yamljs_1.default.load(openApiPath);
            app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc, {
                customSiteTitle: 'DukaanPayAI Backend Platform - Interactive API Docs',
                customCss: '.swagger-ui .topbar { display: none }',
            }));
            app.get('/openapi.yaml', (_req, res) => {
                res.setHeader('Content-Type', 'text/yaml');
                res.sendFile(openApiPath);
            });
            app.get('/openapi.json', (_req, res) => {
                res.json(swaggerDoc);
            });
        }
        catch {
            // ignore
        }
    }
    // 5. Core Domain Route Mounts (API-First Design)
    app.use('/api/v1/auth', (0, auth_routes_1.createAuthRouter)());
    app.use('/api/v1/merchants', (0, merchant_routes_1.createMerchantRouter)());
    app.use('/api/v1/communications', (0, communication_routes_1.createCommunicationRouter)());
    app.use('/api/v1/campaigns', (0, campaign_routes_1.createCampaignRouter)());
    app.use('/api/v1/ai-integration', (0, ai_integration_routes_1.createAIIntegrationRouter)());
    app.use('/api/v1/webhooks', (0, webhook_routes_1.createWebhookRouter)());
    app.use('/api/v1/analytics', (0, analytics_routes_1.createAnalyticsRouter)());
    // 6. Global RFC 7807 Error Handling Middleware
    app.use(error_middleware_1.errorMiddleware);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map