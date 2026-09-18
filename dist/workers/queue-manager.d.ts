import { Queue } from 'bullmq';
export declare const QUEUE_NAMES: {
    readonly NOTIFICATION: "notification_queue";
    readonly WHATSAPP: "whatsapp_queue";
    readonly VOICE_CALL: "voice_call_queue";
    readonly CAMPAIGN: "campaign_queue";
    readonly AUDIT: "audit_queue";
    readonly EMAIL: "email_queue";
};
export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];
export interface EnqueueOptions {
    priority?: number;
    delayMs?: number;
    attempts?: number;
    backoffMs?: number;
}
export declare class QueueManager {
    private static queues;
    private static workers;
    static getRedisConnection(): {
        host: string;
        port: number;
    };
    static getQueue(queueName: QueueName): Queue;
    static enqueue<T = any>(queueName: QueueName, jobName: string, data: T, options?: EnqueueOptions): Promise<string>;
    static registerWorker<T = any>(queueName: QueueName, processor: (jobData: T, jobId: string) => Promise<void>, concurrency?: number): void;
    static getQueueMetrics(): Promise<Record<string, {
        waiting: number;
        active: number;
        failed: number;
    }>>;
    static close(): Promise<void>;
}
//# sourceMappingURL=queue-manager.d.ts.map