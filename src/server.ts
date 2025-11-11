import "reflect-metadata";
import dotenv from "dotenv";
import { createApp } from "./config/app";
import { initializeDatabase } from "./config/database";
import { container } from "./config/container";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function bootstrap() {
  try {
    // Initialize database
    await initializeDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server started successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Environment: ${process.env.NODE_ENV || "development"}
🌐 Server running on: http://${HOST}:${PORT}
📚 API Documentation: http://${HOST}:${PORT}/api/v1
❤️  Health check: http://${HOST}:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Closing server gracefully...`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await sequelize.close();
          console.log("Database connections closed");
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
