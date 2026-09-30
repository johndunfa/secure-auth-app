import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { formatZodErrors } from "../utils/validators";

/** 404 for unmatched routes. */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/** Global error handler — must be registered LAST on the app. */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid input",
      errors: formatZodErrors(err),
    });
    return;
  }

  // Our custom AppError (401, 409, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Mongo duplicate key race condition
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      message: "A user with this email already exists",
    });
    return;
  }

  // Mongoose CastError (bad ObjectId in URL, etc.)
  if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name?: string }).name === "CastError"
  ) {
    res.status(400).json({ message: "Invalid identifier" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
};