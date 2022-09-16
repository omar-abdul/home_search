import { STATUS_CODES } from "http";

class BaseError extends Error {
  statusCode: string | undefined;
  constructor(message: string, statusCode: string | undefined) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(message = "Resource Not Found", statusCode = STATUS_CODES[404]) {
    super(message, statusCode);
  }
}

export class CustomDatabaseError extends BaseError {
  constructor(
    message: string = "Internal Database Error",
    statusCode = STATUS_CODES[500]
  ) {
    super(message, statusCode);
  }
}
export class ValidationError extends BaseError {
  constructor(message: string, statusCode = STATUS_CODES[400]) {
    super(message, statusCode);
  }
}

export class LoginFailureError extends BaseError {
  constructor(message: string, statusCode = STATUS_CODES[200]) {
    super(message, statusCode);
  }
}
