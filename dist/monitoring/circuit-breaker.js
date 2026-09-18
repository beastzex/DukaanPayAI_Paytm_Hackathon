"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.CircuitState = void 0;
const metrics_1 = require("./metrics");
const logger_1 = require("./logger");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
    CircuitState["OPEN"] = "OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
class CircuitBreaker {
    name;
    state = CircuitState.CLOSED;
    failureCount = 0;
    lastFailureTime = 0;
    activeCalls = 0;
    failureThreshold;
    recoveryTimeMs;
    timeoutMs;
    maxConcurrentCalls;
    constructor(name, options = {}) {
        this.name = name;
        this.failureThreshold = options.failureThreshold || 5;
        this.recoveryTimeMs = options.recoveryTimeMs || 10000;
        this.timeoutMs = options.timeoutMs || 5000;
        this.maxConcurrentCalls = options.maxConcurrentCalls || 50;
    }
    getState() {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.recoveryTimeMs) {
                this.state = CircuitState.HALF_OPEN;
                logger_1.logger.info(`Circuit breaker [${this.name}] shifted to HALF_OPEN state`);
            }
        }
        return this.state;
    }
    async execute(action, fallback) {
        const currentState = this.getState();
        if (currentState === CircuitState.OPEN) {
            if (fallback) {
                logger_1.logger.warn(`Circuit [${this.name}] OPEN. Executing graceful fallback.`);
                return fallback();
            }
            throw new Error(`CircuitBreaker [${this.name}] is OPEN. Requests rejected to protect downstream.`);
        }
        // Bulkhead concurrency check
        if (this.activeCalls >= this.maxConcurrentCalls) {
            logger_1.logger.warn(`Bulkhead full for [${this.name}]. Active calls: ${this.activeCalls}`);
            if (fallback)
                return fallback();
            throw new Error(`Bulkhead full for [${this.name}]. Max concurrency of ${this.maxConcurrentCalls} reached.`);
        }
        this.activeCalls++;
        try {
            // Execute with timeout
            const result = await Promise.race([
                action(),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${this.timeoutMs}ms`)), this.timeoutMs)),
            ]);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure(error);
            if (fallback) {
                logger_1.logger.warn(`Execution failed for [${this.name}]. Executing fallback. Error: ${error.message}`);
                return fallback();
            }
            throw error;
        }
        finally {
            this.activeCalls--;
        }
    }
    onSuccess() {
        if (this.state === CircuitState.HALF_OPEN) {
            logger_1.logger.info(`Circuit breaker [${this.name}] recovered! Closing circuit.`);
            this.state = CircuitState.CLOSED;
        }
        this.failureCount = 0;
    }
    onFailure(error) {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        logger_1.logger.error(`Circuit failure [${this.name}] count: ${this.failureCount}. Error: ${error?.message}`);
        if (this.failureCount >= this.failureThreshold || this.state === CircuitState.HALF_OPEN) {
            this.state = CircuitState.OPEN;
            metrics_1.circuitBreakerTripsTotal.inc({ service_name: this.name });
            logger_1.logger.error(`Circuit breaker [${this.name}] TRIPPED to OPEN state!`);
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=circuit-breaker.js.map