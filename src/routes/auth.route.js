import express from "express";
import trimRequest from "trim-request";

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

export default router;
