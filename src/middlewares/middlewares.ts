import type { NextFunction, Request, Response } from "express";

import type ErrorResponse from "../interfaces/error-response.js";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { env } from "../utils/env.js";
import { formatZodError } from "../utils/zod.helper.js";
// eslint-disable-next-line perfectionist/sort-imports
import { ZodError } from "zod";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {

  if (err instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Invalid JSON format, please check your request body',
    });
  }

  if (err instanceof ZodError) {
    return formatZodError(res, err);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
