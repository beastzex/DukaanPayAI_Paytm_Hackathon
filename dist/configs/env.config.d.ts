import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        staging: "staging";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    HOST: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodDefault<z.ZodString>;
    DATABASE_POOL_MIN: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_POOL_MAX: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_READ_REPLICA_URL: z.ZodOptional<z.ZodString>;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    REDIS_PASSWORD: z.ZodOptional<z.ZodString>;
    REDIS_CACHE_DEFAULT_TTL: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    KAFKA_BROKERS: z.ZodDefault<z.ZodString>;
    KAFKA_CLIENT_ID: z.ZodDefault<z.ZodString>;
    KAFKA_GROUP_ID: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    TWILIO_ACCOUNT_SID: z.ZodDefault<z.ZodString>;
    TWILIO_AUTH_TOKEN: z.ZodDefault<z.ZodString>;
    TWILIO_WHATSAPP_NUMBER: z.ZodDefault<z.ZodString>;
    TWILIO_VOICE_NUMBER: z.ZodDefault<z.ZodString>;
    STORAGE_PROVIDER: z.ZodDefault<z.ZodEnum<{
        local: "local";
        s3: "s3";
        minio: "minio";
    }>>;
    STORAGE_BUCKET: z.ZodDefault<z.ZodString>;
    AWS_REGION: z.ZodDefault<z.ZodString>;
    AWS_ACCESS_KEY_ID: z.ZodOptional<z.ZodString>;
    AWS_SECRET_ACCESS_KEY: z.ZodOptional<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        trace: "trace";
        debug: "debug";
        info: "info";
        warn: "warn";
        error: "error";
        fatal: "fatal";
    }>>;
    SENTRY_DSN: z.ZodOptional<z.ZodString>;
    PROMETHEUS_METRICS_ENABLED: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
    USE_IN_MEMORY_DB: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
    USE_EMBEDDED_BUS: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare const config: EnvConfig;
export {};
//# sourceMappingURL=env.config.d.ts.map