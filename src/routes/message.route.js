import express from "express";

import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, sendMessage);
router
  .route("/:conversation_id")
  .get(trimRequest.all, authMiddleware, getMessage);

export default router;
