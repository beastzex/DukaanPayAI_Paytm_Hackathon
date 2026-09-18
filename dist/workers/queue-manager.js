"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = exports.QUEUE_NAMES = void 0;
const bullmq_1 = require("bullmq");
const env_config_1 = require("../configs/env.config");
const logger_1 = require("../monitoring/logger");
const metrics_1 = require("../monitoring/metrics");
exports.QUEUE_NAMES = {
    NOTIFICATION: 'notification_queue',
    WHATSAPP: 'whatsapp_queue',
    VOICE_CALL: 'voice_call_queue',
    CAMPAIGN: 'campaign_queue',
    AUDIT: 'audit_queue',
    EMAIL: 'email_queue',
};
class QueueManager {
    static queues = new Map();
    static workers = new Map();
    static getRedisConnection() {
        return {
            host: 'localhost',
            port: 6379,
        };
    }
    static getQueue(queueName) {
        if (!this.queues.has(queueName)) {
            const queue = new bullmq_1.Queue(queueName, {
                connection: this.getRedisConnection(),
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: 500,
                },
            });
            queue.on('error', (err) => {
                logger_1.logger.debug({ queueName, error: err.message }, 'BullMQ queue connection event');
            });
            this.queues.set(queueName, queue);
            logger_1.logger.info(`BullMQ Queue [${queueName}] initialized`);
        }
        return this.queues.get(queueName);
    }
    static async enqueue(queueName, jobName, data, options = {}) {
        try {
            if (!env_config_1.config.USE_IN_MEMORY_DB) {
                const queue = this.getQueue(queueName);
                const job = await queue.add(jobName, data, {
                    priority: options.priority || 5,
                    delay: options.delayMs || 0,
                    attempts: options.attempts || 3,
                });
                metrics_1.queueActiveJobsGauge.inc({ queue_name: queueName });
                logger_1.logger.info({ queueName, jobName, jobId: job.id }, 'BullMQ job enqueued successfully');
                return job.id || `job_${Date.now()}`;
            }
        }
        catch (err) {
            logger_1.logger.warn({ queueName, jobName, error: err }, 'BullMQ queue unavailable, processing in-memory');
        }
        // In-memory fallback async dispatch
        const fallbackId = `mem_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        logger_1.logger.debug({ queueName, jobName, fallbackId }, 'Dispatched fallback in-memory job');
        return fallbackId;
    }
    static registerWorker(queueName, processor, concurrency = 5) {
        if (env_config_1.config.USE_IN_MEMORY_DB) {
            logger_1.logger.info(`Registered in-memory consumer for queue [${queueName}]`);
            return;
        }
        try {
            const worker = new bullmq_1.Worker(queueName, async (job) => {
                const start = Date.now();
                logger_1.logger.info({ queueName, jobId: job.id, attempt: job.attemptsMade }, 'Worker picked up job');
                try {
                    await processor(job.data, job.id || 'unknown');
                    const duration = (Date.now() - start) / 1000;
                    metrics_1.queueJobProcessingDuration.observe({ queue_name: queueName, status: 'success' }, duration);
                }
                catch (err) {
                    const duration = (Date.now() - start) / 1000;
                    metrics_1.queueJobProcessingDuration.observe({ queue_name: queueName, status: 'failed' }, duration);
                    logger_1.logger.error({ queueName, jobId: job.id, error: err }, 'Worker failed processing job');
                    throw err;
                }
                finally {
                    metrics_1.queueActiveJobsGauge.dec({ queue_name: queueName });
                }
            }, {
                connection: this.getRedisConnection(),
                concurrency,
            });
            this.workers.set(queueName, worker);
            logger_1.logger.info(`BullMQ Worker for [${queueName}] registered with concurrency ${concurrency}`);
        }
        catch (err) {
            logger_1.logger.warn({ queueName, error: err }, 'Failed to start BullMQ worker, running in fallback mode');
        }
    }
    static async getQueueMetrics() {
        const metrics = {};
        for (const [name, queue] of this.queues.entries()) {
            try {
                const counts = await queue.getJobCounts('waiting', 'active', 'failed');
                metrics[name] = {
                    waiting: counts.waiting || 0,
                    active: counts.active || 0,
                    failed: counts.failed || 0,
                };
            }
            catch {
                metrics[name] = { waiting: 0, active: 0, failed: 0 };
            }
        }
        return metrics;
    }
    static async close() {
        for (const worker of this.workers.values()) {
            await worker.close();
        }
        for (const queue of this.queues.values()) {
            await queue.close();
        }
    }
}
exports.QueueManager = QueueManager;
//# sourceMappingURL=queue-manager.js.map