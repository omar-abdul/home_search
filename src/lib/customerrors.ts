import { STATUS_CODES } from "http";
import {
  ValidationError as JoiValidationError,
  ValidationErrorItem,
} from "joi";
export class BaseError extends Error {
  statusCode: number | undefined;
  isTrusted: boolean;
  constructor(
    message: string,
    statusCode: number | undefined,
    isTrusted: boolean
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isTrusted = isTrusted;
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(
    message = "Resource Not Found",
    statusCode = 404,
    isTrusted = true
  ) {
    super(message, statusCode, isTrusted);
  }
}

export class CustomDatabaseError extends BaseError {
  constructor(
    message: string = "Internal Database Error",
    statusCode = 500,
    isTrusted = true
  ) {
    super(message, statusCode, isTrusted);
  }
}
export class ValidationError extends JoiValidationError {
  statusCode: number | undefined;
  isTrusted: boolean | undefined;
  constructor(
    message: string,
    original: any = "",
    details: ValidationErrorItem[] = [],
    statusCode = 400,
    isTrusted = true
  ) {
    super(message, details, original);
    this.statusCode = statusCode;
    this.isTrusted = isTrusted;
  }
}

export class LoginFailureError extends BaseError {
  constructor(message: string, statusCode = 200, isTrusted = true) {
    super(message, statusCode, isTrusted);
  }
}
export class UserInputError extends BaseError {
  constructor(message: string, statusCode = 200, isTrusted = true) {
    super(message, statusCode, isTrusted);
  }
}
