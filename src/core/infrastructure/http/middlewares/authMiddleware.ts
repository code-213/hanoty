import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../../config/jwt";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Debug logging
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      throw new UnauthorizedError("No authorization header provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Invalid authorization format. Use: Bearer <token>"
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Debug logging
    console.log("Token (first 20 chars):", token.substring(0, 20));
    console.log(
      "JWT Secret:",
      jwtConfig.accessTokenSecret.substring(0, 10) + "..."
    );

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as any;

    console.log("Decoded token:", decoded);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    // Better error handling
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token format"));
    }

    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token has expired"));
    }

    if (error instanceof UnauthorizedError) {
      return next(error);
    }

    next(new UnauthorizedError("Authentication failed"));
  }
};

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError("Insufficient permissions"));
    }

    next();
  };
};
