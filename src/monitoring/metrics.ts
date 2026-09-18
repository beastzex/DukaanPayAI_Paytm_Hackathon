import client from 'prom-client';

// Enable collection of default Node.js and runtime metrics
client.collectDefaultMetrics({ prefix: 'dukaanpay_' });

export const metricsRegistry = client.register;

// 1. HTTP Metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'dukaanpay_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

export const httpRequestsTotal = new client.Counter({
  name: 'dukaanpay_http_requests_total',
  help: 'Total number of HTTP requests made',
  labelNames: ['method', 'route', 'status_code'],
});

// 2. Cache Metrics
export const cacheHitsTotal = new client.Counter({
  name: 'dukaanpay_cache_hits_total',
  help: 'Total number of Redis cache hits',
  labelNames: ['namespace'],
});

export const cacheMissesTotal = new client.Counter({
  name: 'dukaanpay_cache_misses_total',
  help: 'Total number of Redis cache misses',
  labelNames: ['namespace'],
});

// 3. Queue & Worker Metrics
export const queueJobProcessingDuration = new client.Histogram({
  name: 'dukaanpay_queue_job_processing_seconds',
  help: 'Duration of BullMQ background jobs in seconds',
  labelNames: ['queue_name', 'status'],
  buckets: [0.05, 0.2, 0.5, 1, 3, 10],
});

export const queueActiveJobsGauge = new client.Gauge({
  name: 'dukaanpay_queue_active_jobs',
  help: 'Current number of active jobs in BullMQ',
  labelNames: ['queue_name'],
});

// 4. Kafka Event Metrics
export const kafkaEventsPublishedTotal = new client.Counter({
  name: 'dukaanpay_kafka_events_published_total',
  help: 'Total number of Kafka events dispatched',
  labelNames: ['topic'],
});

export const kafkaEventsConsumedTotal = new client.Counter({
  name: 'dukaanpay_kafka_events_consumed_total',
  help: 'Total number of Kafka events processed',
  labelNames: ['topic', 'status'],
});

// 5. Circuit Breaker Metrics
export const circuitBreakerTripsTotal = new client.Counter({
  name: 'dukaanpay_circuit_breaker_trips_total',
  help: 'Total number of times a circuit breaker has opened',
  labelNames: ['service_name'],
});
