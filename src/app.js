import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import fileUpload from "express-fileupload";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";
import { translate } from "bing-translate-api";

const app = express();

// using Morgan
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// using helmet
app.use(helmet());

// parse json request body
app.use(express.json());

// parse json request url
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(ExpressMongoSanitize());

// using  Cookie parser
app.use(cookieParser());

//gzip compressing request data
app.use(compression());

// file upload
app.use(fileUpload({ useTempFiles: true }));

// enabling cors
app.use(cors());

// mounting routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello from the server",
  });
});

app.post("/", (req, res) => {
  throw createHttpError.BadRequest("This route has an error");
});

// error handling route not found
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

// error handling for http request
app.use(async (err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      success: false,
      message: err.message,
    },
  });
});

export default app;
