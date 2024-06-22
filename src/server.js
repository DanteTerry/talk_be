import app from "./app.js";
import dotenv from "dotenv";
import logger from "./configs/logger.js";

// dotEnv Config
dotenv.config();

// env Variable
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server is listing on PORT ${PORT}..`);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

// handle server errors
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// handling unexpected exception and Rejection
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// sigterm
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
