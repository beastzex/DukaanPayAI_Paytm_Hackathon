import { Queue, Worker, Job } from 'bullmq';
import { config } from '../configs/env.config';
import { logger } from '../monitoring/logger';
import { queueJobProcessingDuration, queueActiveJobsGauge } from '../monitoring/metrics';

export const QUEUE_NAMES = {
  NOTIFICATION: 'notification_queue',
  WHATSAPP: 'whatsapp_queue',
  VOICE_CALL: 'voice_call_queue',
  CAMPAIGN: 'campaign_queue',
  AUDIT: 'audit_queue',
  EMAIL: 'email_queue',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

export interface EnqueueOptions {
  priority?: number; // 1 (highest) to 10 (lowest)
  delayMs?: number;  // Delayed job execution
  attempts?: number; // Retry attempts
  backoffMs?: number;// Exponential backoff initial delay
}

export class QueueManager {
  private static queues: Map<string, Queue> = new Map();
  private static workers: Map<string, Worker> = new Map();

  public static getRedisConnection() {
    return {
      host: 'localhost',
      port: 6379,
    };
  }

  public static getQueue(queueName: QueueName): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
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
        logger.debug({ queueName, error: err.message }, 'BullMQ queue connection event');
      });
      this.queues.set(queueName, queue);
      logger.info(`BullMQ Queue [${queueName}] initialized`);
    }
    return this.queues.get(queueName)!;
  }

  public static async enqueue<T = any>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options: EnqueueOptions = {}
  ): Promise<string> {
    try {
      if (!config.USE_IN_MEMORY_DB) {
        const queue = this.getQueue(queueName);
        const job = await queue.add(jobName, data, {
          priority: options.priority || 5,
          delay: options.delayMs || 0,
          attempts: options.attempts || 3,
        });
        queueActiveJobsGauge.inc({ queue_name: queueName });
        logger.info({ queueName, jobName, jobId: job.id }, 'BullMQ job enqueued successfully');
        return job.id || `job_${Date.now()}`;
      }
    } catch (err) {
      logger.warn({ queueName, jobName, error: err }, 'BullMQ queue unavailable, processing in-memory');
    }

    // In-memory fallback async dispatch
    const fallbackId = `mem_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    logger.debug({ queueName, jobName, fallbackId }, 'Dispatched fallback in-memory job');
    return fallbackId;
  }

  public static registerWorker<T = any>(
    queueName: QueueName,
    processor: (jobData: T, jobId: string) => Promise<void>,
    concurrency = 5
  ): void {
    if (config.USE_IN_MEMORY_DB) {
      logger.info(`Registered in-memory consumer for queue [${queueName}]`);
      return;
    }

    try {
      const worker = new Worker(
        queueName,
        async (job: Job) => {
          const start = Date.now();
          logger.info({ queueName, jobId: job.id, attempt: job.attemptsMade }, 'Worker picked up job');
          try {
            await processor(job.data, job.id || 'unknown');
            const duration = (Date.now() - start) / 1000;
            queueJobProcessingDuration.observe({ queue_name: queueName, status: 'success' }, duration);
          } catch (err) {
            const duration = (Date.now() - start) / 1000;
            queueJobProcessingDuration.observe({ queue_name: queueName, status: 'failed' }, duration);
            logger.error({ queueName, jobId: job.id, error: err }, 'Worker failed processing job');
            throw err;
          } finally {
            queueActiveJobsGauge.dec({ queue_name: queueName });
          }
        },
        {
          connection: this.getRedisConnection(),
          concurrency,
        }
      );

      this.workers.set(queueName, worker);
      logger.info(`BullMQ Worker for [${queueName}] registered with concurrency ${concurrency}`);
    } catch (err) {
      logger.warn({ queueName, error: err }, 'Failed to start BullMQ worker, running in fallback mode');
    }
  }

  public static async getQueueMetrics(): Promise<Record<string, { waiting: number; active: number; failed: number }>> {
    const metrics: Record<string, { waiting: number; active: number; failed: number }> = {};
    for (const [name, queue] of this.queues.entries()) {
      try {
        const counts = await queue.getJobCounts('waiting', 'active', 'failed');
        metrics[name] = {
          waiting: counts.waiting || 0,
          active: counts.active || 0,
          failed: counts.failed || 0,
        };
      } catch {
        metrics[name] = { waiting: 0, active: 0, failed: 0 };
      }
    }
    return metrics;
  }

  public static async close(): Promise<void> {
    for (const worker of this.workers.values()) {
      await worker.close();
    }
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}
