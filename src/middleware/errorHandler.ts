import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors";
import { ZodError } from "zod";

// Global error handling middleware
// Catches all errors and formats them into consistent JSON responses

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  // Handle custom AppError and its subclasses
  if (err instanceof AppError) {
    const response: any = {
      success: false,
      message: err.message,
    };

    if (err.details) {
      response.details = err.details;
    }

    // Only include stack trace in development
    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors (programming errors)
  console.error("Unexpected error:", err);

  const response: any = {
    success: false,
    message: process.env.NODE_ENV === "development" 
      ? err.message 
      : "An unexpected error occurred",
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
