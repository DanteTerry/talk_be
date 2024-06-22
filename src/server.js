import app from "./app.js";
import dotenv from "dotenv";
import logger from "./configs/logger.js";

// dotEnv Config
dotenv.config();

// env Variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is listing on PORT ${PORT}..`);
});
