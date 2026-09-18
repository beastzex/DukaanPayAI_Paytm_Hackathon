import { circuitBreakerTripsTotal } from './metrics';
import { logger } from './logger';

export enum CircuitState {
  CLOSED = 'CLOSED',
  HALF_OPEN = 'HALF_OPEN',
  OPEN = 'OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Failures before opening
  recoveryTimeMs?: number;   // Time to wait before testing recovery
  timeoutMs?: number;        // Max execution time per call
  maxConcurrentCalls?: number; // Bulkhead limit
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private activeCalls = 0;

  private readonly failureThreshold: number;
  private readonly recoveryTimeMs: number;
  private readonly timeoutMs: number;
  private readonly maxConcurrentCalls: number;

  constructor(
    public readonly name: string,
    options: CircuitBreakerOptions = {}
  ) {
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeMs = options.recoveryTimeMs || 10000;
    this.timeoutMs = options.timeoutMs || 5000;
    this.maxConcurrentCalls = options.maxConcurrentCalls || 50;
  }

  public getState(): CircuitState {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeMs) {
        this.state = CircuitState.HALF_OPEN;
        logger.info(`Circuit breaker [${this.name}] shifted to HALF_OPEN state`);
      }
    }
    return this.state;
  }

  public async execute<T>(action: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === CircuitState.OPEN) {
      if (fallback) {
        logger.warn(`Circuit [${this.name}] OPEN. Executing graceful fallback.`);
        return fallback();
      }
      throw new Error(`CircuitBreaker [${this.name}] is OPEN. Requests rejected to protect downstream.`);
    }

    // Bulkhead concurrency check
    if (this.activeCalls >= this.maxConcurrentCalls) {
      logger.warn(`Bulkhead full for [${this.name}]. Active calls: ${this.activeCalls}`);
      if (fallback) return fallback();
      throw new Error(`Bulkhead full for [${this.name}]. Max concurrency of ${this.maxConcurrentCalls} reached.`);
    }

    this.activeCalls++;

    try {
      // Execute with timeout
      const result = await Promise.race([
        action(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Operation timed out after ${this.timeoutMs}ms`)), this.timeoutMs)
        ),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      if (fallback) {
        logger.warn(`Execution failed for [${this.name}]. Executing fallback. Error: ${(error as Error).message}`);
        return fallback();
      }
      throw error;
    } finally {
      this.activeCalls--;
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      logger.info(`Circuit breaker [${this.name}] recovered! Closing circuit.`);
      this.state = CircuitState.CLOSED;
    }
    this.failureCount = 0;
  }

  private onFailure(error: any): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    logger.error(`Circuit failure [${this.name}] count: ${this.failureCount}. Error: ${error?.message}`);

    if (this.failureCount >= this.failureThreshold || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      circuitBreakerTripsTotal.inc({ service_name: this.name });
      logger.error(`Circuit breaker [${this.name}] TRIPPED to OPEN state!`);
    }
  }
}
