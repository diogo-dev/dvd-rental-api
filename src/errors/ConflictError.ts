import { AppError } from "./AppError";

// Error thrown when there's a conflict with existing data
// HTTP Status: 409

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", details?: any) {
    super(message, 409, true, details);
  }
}
