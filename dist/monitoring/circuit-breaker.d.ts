export declare enum CircuitState {
    CLOSED = "CLOSED",
    HALF_OPEN = "HALF_OPEN",
    OPEN = "OPEN"
}
export interface CircuitBreakerOptions {
    failureThreshold?: number;
    recoveryTimeMs?: number;
    timeoutMs?: number;
    maxConcurrentCalls?: number;
}
export declare class CircuitBreaker {
    readonly name: string;
    private state;
    private failureCount;
    private lastFailureTime;
    private activeCalls;
    private readonly failureThreshold;
    private readonly recoveryTimeMs;
    private readonly timeoutMs;
    private readonly maxConcurrentCalls;
    constructor(name: string, options?: CircuitBreakerOptions);
    getState(): CircuitState;
    execute<T>(action: () => Promise<T>, fallback?: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
}
//# sourceMappingURL=circuit-breaker.d.ts.map