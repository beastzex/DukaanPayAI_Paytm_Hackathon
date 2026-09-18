export declare abstract class DomainException extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: string;
    constructor(message: string);
}
export declare class EntityNotFoundException extends DomainException {
    readonly statusCode = 404;
    readonly errorCode = "ENTITY_NOT_FOUND";
    constructor(entityName: string, id: string);
}
export declare class ConflictException extends DomainException {
    readonly statusCode = 409;
    readonly errorCode = "RESOURCE_CONFLICT";
    constructor(message: string);
}
export declare class OptimisticLockException extends DomainException {
    readonly statusCode = 409;
    readonly errorCode = "CONCURRENCY_CONFLICT";
    constructor(entityName: string, id: string, currentVersion: number);
}
export declare class UnauthorizedException extends DomainException {
    readonly statusCode = 401;
    readonly errorCode = "UNAUTHORIZED";
    constructor(message?: string);
}
export declare class ForbiddenException extends DomainException {
    readonly statusCode = 403;
    readonly errorCode = "FORBIDDEN";
    constructor(message?: string);
}
export declare class ValidationException extends DomainException {
    readonly details?: any | undefined;
    readonly statusCode = 422;
    readonly errorCode = "VALIDATION_FAILED";
    constructor(message: string, details?: any | undefined);
}
//# sourceMappingURL=domain-exceptions.d.ts.map