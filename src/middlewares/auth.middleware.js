import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import logger from "../configs/logger.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function verifyToken(req, res, next) {
  if (!req.headers["authorization"]) {
    return next(createHttpError.Unauthorized("Unauthorized request"));
  }

  const bearerToken = req.headers["authorization"];
  const tokenParts = bearerToken.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return next(createHttpError.Unauthorized("Invalid token format"));
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      logger.error(err.message);
      return next(createHttpError.Unauthorized("Invalid token"));
    }

    req.user = payload;
    next();
  });
}

export default verifyToken;
