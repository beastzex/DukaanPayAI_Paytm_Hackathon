"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.circuitBreakerTripsTotal = exports.kafkaEventsConsumedTotal = exports.kafkaEventsPublishedTotal = exports.queueActiveJobsGauge = exports.queueJobProcessingDuration = exports.cacheMissesTotal = exports.cacheHitsTotal = exports.httpRequestsTotal = exports.httpRequestDurationMicroseconds = exports.metricsRegistry = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Enable collection of default Node.js and runtime metrics
prom_client_1.default.collectDefaultMetrics({ prefix: 'dukaanpay_' });
exports.metricsRegistry = prom_client_1.default.register;
// 1. HTTP Metrics
exports.httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: 'dukaanpay_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
exports.httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_http_requests_total',
    help: 'Total number of HTTP requests made',
    labelNames: ['method', 'route', 'status_code'],
});
// 2. Cache Metrics
exports.cacheHitsTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_cache_hits_total',
    help: 'Total number of Redis cache hits',
    labelNames: ['namespace'],
});
exports.cacheMissesTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_cache_misses_total',
    help: 'Total number of Redis cache misses',
    labelNames: ['namespace'],
});
// 3. Queue & Worker Metrics
exports.queueJobProcessingDuration = new prom_client_1.default.Histogram({
    name: 'dukaanpay_queue_job_processing_seconds',
    help: 'Duration of BullMQ background jobs in seconds',
    labelNames: ['queue_name', 'status'],
    buckets: [0.05, 0.2, 0.5, 1, 3, 10],
});
exports.queueActiveJobsGauge = new prom_client_1.default.Gauge({
    name: 'dukaanpay_queue_active_jobs',
    help: 'Current number of active jobs in BullMQ',
    labelNames: ['queue_name'],
});
// 4. Kafka Event Metrics
exports.kafkaEventsPublishedTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_kafka_events_published_total',
    help: 'Total number of Kafka events dispatched',
    labelNames: ['topic'],
});
exports.kafkaEventsConsumedTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_kafka_events_consumed_total',
    help: 'Total number of Kafka events processed',
    labelNames: ['topic', 'status'],
});
// 5. Circuit Breaker Metrics
exports.circuitBreakerTripsTotal = new prom_client_1.default.Counter({
    name: 'dukaanpay_circuit_breaker_trips_total',
    help: 'Total number of times a circuit breaker has opened',
    labelNames: ['service_name'],
});
//# sourceMappingURL=metrics.js.map