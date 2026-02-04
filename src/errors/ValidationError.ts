import { AppError } from "./AppError";

// Error thrown when input validation fails
// HTTP Status: 400

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, 400, true, details);
  }
}
