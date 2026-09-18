"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'staging', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    HOST: zod_1.z.string().default('0.0.0.0'),
    // Database (PostgreSQL)
    DATABASE_URL: zod_1.z.string().default('postgresql://postgres:postgres@localhost:5432/dukaanpay_db'),
    DATABASE_POOL_MIN: zod_1.z.coerce.number().default(2),
    DATABASE_POOL_MAX: zod_1.z.coerce.number().default(20),
    DATABASE_READ_REPLICA_URL: zod_1.z.string().optional(),
    // Caching & In-Memory Store (Redis)
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_CACHE_DEFAULT_TTL: zod_1.z.coerce.number().default(3600), // 1 hour
    // Messaging (Kafka)
    KAFKA_BROKERS: zod_1.z.string().default('localhost:9092'),
    KAFKA_CLIENT_ID: zod_1.z.string().default('dukaanpay-backend'),
    KAFKA_GROUP_ID: zod_1.z.string().default('dukaanpay-core-group'),
    // Authentication & Security
    JWT_SECRET: zod_1.z.string().default('dukaanpay-enterprise-jwt-secret-key-min32chars'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_SECRET: zod_1.z.string().default('dukaanpay-enterprise-refresh-secret-key-min32'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Twilio Integration (WhatsApp & Voice)
    TWILIO_ACCOUNT_SID: zod_1.z.string().default('AC_mock_twilio_account_sid_placeholder'),
    TWILIO_AUTH_TOKEN: zod_1.z.string().default('mock_twilio_auth_token_secret_placeholder'),
    TWILIO_WHATSAPP_NUMBER: zod_1.z.string().default('whatsapp:+14155238886'),
    TWILIO_VOICE_NUMBER: zod_1.z.string().default('+12025550143'),
    // Storage
    STORAGE_PROVIDER: zod_1.z.enum(['local', 's3', 'minio']).default('local'),
    STORAGE_BUCKET: zod_1.z.string().default('dukaanpay-assets'),
    AWS_REGION: zod_1.z.string().default('ap-south-1'),
    AWS_ACCESS_KEY_ID: zod_1.z.string().optional(),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    // Observability & Sentry
    LOG_LEVEL: zod_1.z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    SENTRY_DSN: zod_1.z.string().optional(),
    PROMETHEUS_METRICS_ENABLED: zod_1.z.coerce.boolean().default(true),
    // Fallbacks for zero-dependency local execution
    USE_IN_MEMORY_DB: zod_1.z.coerce.boolean().default(true),
    USE_EMBEDDED_BUS: zod_1.z.coerce.boolean().default(true),
});
exports.config = envSchema.parse(process.env);
//# sourceMappingURL=env.config.js.map