import { Request, Response, NextFunction } from "express";

//Wraps async route handlers to catch errors and pass them to the error middleware
//Eliminates the need for try-catch blocks in every controller method

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
