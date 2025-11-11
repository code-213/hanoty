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

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
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
