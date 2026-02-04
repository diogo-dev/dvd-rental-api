import { AppError } from "./AppError";

//Error thrown when the request cannot be processed due to client error
// HTTP Status: 400

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", details?: any) {
    super(message, 400, true, details);
  }
}
