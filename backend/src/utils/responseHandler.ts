export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string, stack?: string) {
    super();
    this.message = message;
    this.name = "Not Found";
    this.statusCode = 404;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string, stack?: string) {
    super();
    this.message = message;
    this.statusCode = 400;
    this.name = "Bad Request";
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string, stack?: string) {
    super();
    this.message = message;
    this.name = "Unauthorized";
    this.statusCode = 401;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class TooManyRequestsError extends Error {
  statusCode: number;
  constructor(message: string, stack?: string) {
    super();
    this.message = message;
    this.name = "Too Many Requests";
    this.statusCode = 429;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ApplicationError extends Error {
  statusCode: number;
  constructor(message: string, stack?: string) {
    super();
    this.message = message;
    this.name = "Application Error";
    this.statusCode = 500;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ApiResponse<T = unknown> {
  message: string;
  statusCode: number;
  data?: T;

  constructor(message: string, statusCode: number = 200, data?: T) {
    this.message = message;
    this.statusCode = statusCode;
    if (typeof data !== "undefined") {
      this.data = data;
    }
  }
}
