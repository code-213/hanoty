import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { ValidationError } from "../../../shared/errors/ValidationError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err instanceof ValidationError &&
        err.errors && { errors: err.errors }),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
