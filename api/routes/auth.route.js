import express from "express";
import trimRequest from "trim-request";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  logOut,
  login,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(trimRequest.all, register);
router.route("/login").post(trimRequest.all, login);
router.route("/logout").post(trimRequest.all, logOut);
router.route("/refreshToken").post(trimRequest.all, refreshToken);
router
  .route("/testingAuthMiddleware")
  .get(trimRequest.all, verifyToken, (req, res) => {
    res.send(req.user);
  });

export default router;
