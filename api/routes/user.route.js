import express from "express";
import trimRequest from "trim-request";
import { findUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(trimRequest.all, authMiddleware, findUser);

export default router;
