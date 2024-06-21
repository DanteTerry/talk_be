import app from "./app.js";
import dotenv from "dotenv";

// dotEnv Config
dotenv.config();

// env Variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listing on PORT ${PORT}..`);
});
