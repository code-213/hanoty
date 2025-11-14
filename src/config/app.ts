import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import routes from "../core/infrastructure/http/routes";
import { errorMiddleware } from "../core/infrastructure/http/middlewares/errorMiddleware";
import { rateLimitMiddleware } from "../core/infrastructure/http/middlewares/rateLimitMiddleware";

export const createApp = (): Application => {
  const app = express();

  // Parse allowed origins from environment variable
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["http://localhost:8080"];

  console.log("🌐 Configured CORS allowed origins:", allowedOrigins);

  // Security middlewares
  app.use(helmet());

  // Fixed CORS configuration - returns single origin per request
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) {
          return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          console.log(`✅ CORS allowed for origin: ${origin}`);
          callback(null, origin); // Return the matching origin
        } else {
          console.warn(`❌ CORS blocked origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    })
  );

  // Request parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Compression
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }

  // Rate limiting
  app.use("/api", rateLimitMiddleware);

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api/v1", routes);

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  // Error handling
  app.use(errorMiddleware);

  return app;
};
