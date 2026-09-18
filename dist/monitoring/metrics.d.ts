import client from 'prom-client';
export declare const metricsRegistry: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const httpRequestDurationMicroseconds: client.Histogram<"route" | "method" | "status_code">;
export declare const httpRequestsTotal: client.Counter<"route" | "method" | "status_code">;
export declare const cacheHitsTotal: client.Counter<"namespace">;
export declare const cacheMissesTotal: client.Counter<"namespace">;
export declare const queueJobProcessingDuration: client.Histogram<"queue_name" | "status">;
export declare const queueActiveJobsGauge: client.Gauge<"queue_name">;
export declare const kafkaEventsPublishedTotal: client.Counter<"topic">;
export declare const kafkaEventsConsumedTotal: client.Counter<"status" | "topic">;
export declare const circuitBreakerTripsTotal: client.Counter<"service_name">;
//# sourceMappingURL=metrics.d.ts.map