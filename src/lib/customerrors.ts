import { STATUS_CODES } from "http";

class BaseError extends Error {
  statusCode: number | undefined;
  constructor(message: string, statusCode: number | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(message = "Resource Not Found", statusCode = 404) {
    super(message, statusCode);
  }
}

export class CustomDatabaseError extends BaseError {
  constructor(message: string = "Internal Database Error", statusCode = 500) {
    super(message, statusCode);
  }
}
export class ValidationError extends BaseError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
  }
}

export class LoginFailureError extends BaseError {
  constructor(message: string, statusCode = 200) {
    super(message, statusCode);
  }
}
