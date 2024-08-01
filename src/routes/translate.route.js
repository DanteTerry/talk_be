import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { translatedMessage } from "../controllers/translate.controller.js";

const router = express.Router();

router.route("/").post(trimRequest.all, translatedMessage);

export default router;
