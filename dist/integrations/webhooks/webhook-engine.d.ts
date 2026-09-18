export interface WebhookPayload<T = any> {
    id: string;
    event: string;
    timestamp: string;
    data: T;
}
export interface WebhookDeliveryLog {
    deliveryId: string;
    subscriptionId: string;
    targetUrl: string;
    event: string;
    status: 'SUCCESS' | 'FAILED' | 'DLQ';
    statusCode?: number;
    attemptNumber: number;
    deliveredAt: string;
    errorMessage?: string;
}
export declare class WebhookEngine {
    /**
     * Generates HMAC-SHA256 signature for outgoing webhook payload.
     */
    static signPayload(payload: string | Record<string, any>, secret: string): string;
    /**
     * Verifies incoming webhook signature against raw body and secret.
     */
    static verifySignature(payload: string | Record<string, any>, signature: string, secret: string): boolean;
    /**
     * Dispatches an outgoing webhook to a target URL with cryptographic signature and retries.
     */
    static dispatch<T>(subscriptionId: string, targetUrl: string, secret: string, event: string, data: T, maxAttempts?: number): Promise<boolean>;
    /**
     * Replays a failed webhook from the Dead Letter Queue.
     */
    static replayDLQ(index: number): Promise<boolean>;
    static getDeliveryLogs(): WebhookDeliveryLog[];
    static getDLQCount(): number;
    private static sendHttpRequest;
}
//# sourceMappingURL=webhook-engine.d.ts.map