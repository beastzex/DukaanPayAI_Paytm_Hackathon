import { createApp } from './app';
import { config } from './configs/env.config';
import { logger } from './monitoring/logger';
import { PostgresClient } from './infrastructure/database/postgres-client';
import { RedisClient } from './infrastructure/redis/redis-client';
import { KafkaEventBus } from './events/kafka-client';
import { TwilioClient } from './integrations/twilio/twilio-client';
import { StorageManager } from './infrastructure/storage/storage-manager';
import { QueueManager } from './workers/queue-manager';

const bootstrap = async () => {
  logger.info('🚀 Bootstrapping DukaanPayAI Enterprise Backend Platform...');

  // Initialize Infrastructure Adapters
  PostgresClient.initialize();
  RedisClient.initialize();
  await KafkaEventBus.initialize();
  TwilioClient.initialize();
  StorageManager.initialize();

  const app = createApp();
  const server = app.listen(config.PORT, config.HOST, () => {
    logger.info(`✅ Clean Architecture Backend Platform active at http://${config.HOST}:${config.PORT}`);
    logger.info(`Environment: ${config.NODE_ENV} | Metrics: http://${config.HOST}:${config.PORT}/metrics`);
  });

  // Graceful Shutdown Handler
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await QueueManager.close();
        await KafkaEventBus.disconnect();
        await PostgresClient.close();
        logger.info('All database, queue, and broker connections drained cleanly.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during graceful shutdown drain');
        process.exit(1);
      }
    });

    // Force exit if hanging
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

if (require.main === module) {
  bootstrap().catch((err) => {
    logger.fatal('Fatal error during backend platform bootstrap', err);
    process.exit(1);
  });
}

export { bootstrap };
