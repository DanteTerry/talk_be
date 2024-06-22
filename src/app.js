import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import fileUpload from "express-fileupload";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

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

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello from the server",
  });
});

app.post("/", (req, res) => {
  res.status(200).json(req.body);
});

export default app;
