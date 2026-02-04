import { AppError } from "./AppError";

// Error thrown when authentication fails
// HTTP Status: 401

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access", details?: any) {
    super(message, 401, true, details);
  }
}
