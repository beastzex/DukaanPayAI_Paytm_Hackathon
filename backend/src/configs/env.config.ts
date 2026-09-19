import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),

  // Database (PostgreSQL)
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/dukaanpay_db'),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(20),
  DATABASE_READ_REPLICA_URL: z.string().optional(),

  // Caching & In-Memory Store (Redis)
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_CACHE_DEFAULT_TTL: z.coerce.number().default(3600), // 1 hour

  // Messaging (Kafka)
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_CLIENT_ID: z.string().default('dukaanpay-backend'),
  KAFKA_GROUP_ID: z.string().default('dukaanpay-core-group'),

  // Authentication & Security
  JWT_SECRET: z.string().default('dukaanpay-enterprise-jwt-secret-key-min32chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('dukaanpay-enterprise-refresh-secret-key-min32'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Twilio Integration (WhatsApp & Voice)
  TWILIO_ACCOUNT_SID: z.string().default('AC_mock_twilio_account_sid_placeholder'),
  TWILIO_AUTH_TOKEN: z.string().default('mock_twilio_auth_token_secret_placeholder'),
  TWILIO_WHATSAPP_NUMBER: z.string().default('whatsapp:+14155238886'),
  TWILIO_VOICE_NUMBER: z.string().default('+12025550143'),

  // Storage
  STORAGE_PROVIDER: z.enum(['local', 's3', 'minio']).default('local'),
  STORAGE_BUCKET: z.string().default('dukaanpay-assets'),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Observability & Sentry
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  SENTRY_DSN: z.string().optional(),
  PROMETHEUS_METRICS_ENABLED: z.coerce.boolean().default(true),

  // Fallbacks for zero-dependency local execution
  USE_IN_MEMORY_DB: z.coerce.boolean().default(true),
  USE_EMBEDDED_BUS: z.coerce.boolean().default(true),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const config: EnvConfig = envSchema.parse(process.env);
