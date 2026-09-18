"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const app_1 = require("./app");
const env_config_1 = require("./configs/env.config");
const logger_1 = require("./monitoring/logger");
const postgres_client_1 = require("./infrastructure/database/postgres-client");
const redis_client_1 = require("./infrastructure/redis/redis-client");
const kafka_client_1 = require("./events/kafka-client");
const twilio_client_1 = require("./integrations/twilio/twilio-client");
const storage_manager_1 = require("./infrastructure/storage/storage-manager");
const queue_manager_1 = require("./workers/queue-manager");
const bootstrap = async () => {
    logger_1.logger.info('🚀 Bootstrapping DukaanPayAI Enterprise Backend Platform...');
    // Initialize Infrastructure Adapters
    postgres_client_1.PostgresClient.initialize();
    redis_client_1.RedisClient.initialize();
    await kafka_client_1.KafkaEventBus.initialize();
    twilio_client_1.TwilioClient.initialize();
    storage_manager_1.StorageManager.initialize();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_config_1.config.PORT, env_config_1.config.HOST, () => {
        logger_1.logger.info(`✅ Clean Architecture Backend Platform active at http://${env_config_1.config.HOST}:${env_config_1.config.PORT}`);
        logger_1.logger.info(`Environment: ${env_config_1.config.NODE_ENV} | Metrics: http://${env_config_1.config.HOST}:${env_config_1.config.PORT}/metrics`);
    });
    // Graceful Shutdown Handler
    const gracefulShutdown = async (signal) => {
        logger_1.logger.info(`Received ${signal}. Starting graceful shutdown...`);
        server.close(async () => {
            logger_1.logger.info('HTTP server closed.');
            try {
                await queue_manager_1.QueueManager.close();
                await kafka_client_1.KafkaEventBus.disconnect();
                await postgres_client_1.PostgresClient.close();
                logger_1.logger.info('All database, queue, and broker connections drained cleanly.');
                process.exit(0);
            }
            catch (err) {
                logger_1.logger.error({ err }, 'Error during graceful shutdown drain');
                process.exit(1);
            }
        });
        // Force exit if hanging
        setTimeout(() => {
            logger_1.logger.error('Forced shutdown due to timeout');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};
exports.bootstrap = bootstrap;
if (require.main === module) {
    bootstrap().catch((err) => {
        logger_1.logger.fatal('Fatal error during backend platform bootstrap', err);
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map