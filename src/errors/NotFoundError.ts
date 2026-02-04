import { AppError } from "./AppError";

// Error thrown when a requested resource is not found
// HTTP Status: 404

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, true, details);
  }
}
