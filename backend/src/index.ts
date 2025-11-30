import app from "./app";
import logger from "./config/logger.config";

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started successfully => http://localhost:${PORT}/`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    url: `http://localhost:${PORT}/`,
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});