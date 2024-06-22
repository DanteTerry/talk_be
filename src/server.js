import app from "./app.js";
import dotenv from "dotenv";
import logger from "./configs/logger.js";
import mongoose from "mongoose";

// dotEnv Config
dotenv.config();

// env Variable
const PORT = process.env.PORT;
const { MONGO_URL } = process.env;

// mongodb connection
mongoose.connect(MONGO_URL).then(() => {
  logger.info("Connected to MONGODB");
});

// exit on mongodb connection error
mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error : ${err}`);
  process.exit(1);
});

// mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// listing to server
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
