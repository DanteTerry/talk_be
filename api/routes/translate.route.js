import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  translateAllMessage,
  translatedMessage,
} from "../controllers/translate.controller.js";

const router = express.Router();

router.route("/one").post(trimRequest.all, authMiddleware, translatedMessage);
router.route("/").post(trimRequest.all, authMiddleware, translateAllMessage);

export default router;
