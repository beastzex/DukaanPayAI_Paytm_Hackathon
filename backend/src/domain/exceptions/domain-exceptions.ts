export abstract class DomainException extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  public readonly statusCode = 404;
  public readonly errorCode = 'ENTITY_NOT_FOUND';

  constructor(entityName: string, id: string) {
    super(`${entityName} with identifier '${id}' was not found.`);
  }
}

export class ConflictException extends DomainException {
  public readonly statusCode = 409;
  public readonly errorCode = 'RESOURCE_CONFLICT';

  constructor(message: string) {
    super(message);
  }
}

export class OptimisticLockException extends DomainException {
  public readonly statusCode = 409;
  public readonly errorCode = 'CONCURRENCY_CONFLICT';

  constructor(entityName: string, id: string, currentVersion: number) {
    super(`Optimistic lock conflict on ${entityName} (${id}). Expected version: ${currentVersion}.`);
  }
}

export class UnauthorizedException extends DomainException {
  public readonly statusCode = 401;
  public readonly errorCode = 'UNAUTHORIZED';

  constructor(message = 'Invalid or missing authentication credentials.') {
    super(message);
  }
}

export class ForbiddenException extends DomainException {
  public readonly statusCode = 403;
  public readonly errorCode = 'FORBIDDEN';

  constructor(message = 'Access denied. Insufficient permissions.') {
    super(message);
  }
}

export class ValidationException extends DomainException {
  public readonly statusCode = 422;
  public readonly errorCode = 'VALIDATION_FAILED';

  constructor(message: string, public readonly details?: any) {
    super(message);
  }
}
