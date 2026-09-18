"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.ForbiddenException = exports.UnauthorizedException = exports.OptimisticLockException = exports.ConflictException = exports.EntityNotFoundException = exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainException = DomainException;
class EntityNotFoundException extends DomainException {
    statusCode = 404;
    errorCode = 'ENTITY_NOT_FOUND';
    constructor(entityName, id) {
        super(`${entityName} with identifier '${id}' was not found.`);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class ConflictException extends DomainException {
    statusCode = 409;
    errorCode = 'RESOURCE_CONFLICT';
    constructor(message) {
        super(message);
    }
}
exports.ConflictException = ConflictException;
class OptimisticLockException extends DomainException {
    statusCode = 409;
    errorCode = 'CONCURRENCY_CONFLICT';
    constructor(entityName, id, currentVersion) {
        super(`Optimistic lock conflict on ${entityName} (${id}). Expected version: ${currentVersion}.`);
    }
}
exports.OptimisticLockException = OptimisticLockException;
class UnauthorizedException extends DomainException {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    constructor(message = 'Invalid or missing authentication credentials.') {
        super(message);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends DomainException {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    constructor(message = 'Access denied. Insufficient permissions.') {
        super(message);
    }
}
exports.ForbiddenException = ForbiddenException;
class ValidationException extends DomainException {
    details;
    statusCode = 422;
    errorCode = 'VALIDATION_FAILED';
    constructor(message, details) {
        super(message);
        this.details = details;
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=domain-exceptions.js.map