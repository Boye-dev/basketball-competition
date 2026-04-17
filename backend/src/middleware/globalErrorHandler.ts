import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import logger from "../utils/logger";

interface CustomError extends Error {
  [key: string]: unknown;
}

export const globalErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = (error?.statusCode as number) || 500;
  let message = error?.message || "Internal Server Error";
  let fields: { message: string; path: string | number }[] = [];

  if (error instanceof ValidationError) {
    if (error.details.body) {
      const errors = error.details.body?.map((value) => {
        return { message: value.message, path: value.path[0] };
      });
      fields = [...fields, ...errors];
    }
    if (error.details.params) {
      const errors = error.details.params?.map((value) => {
        return { message: value.message, path: value.path[0] };
      });
      fields = [...fields, ...errors];
    }
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Failed";
    if (error.errors) {
      const errors = Object.entries(error.errors).map(
        ([key, value]: [string, unknown]) => {
          return {
            path: key,
            message: (value as { properties: { message: string } }).properties
              .message,
          };
        },
      );
      fields = [...fields, ...errors];
    }
  }

  if (statusCode >= 500) {
    message = "Internal Server Error";
  }

  logger.error({ err: error }, "Unhandled error");

  return res.status(statusCode).json({
    message,
    statusCode,
    ...(fields.length > 0 && { fields }),
  });
};
