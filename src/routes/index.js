import express from "express";
import authRoute from "./auth.route.js";
import conversationRoute from "./conversation.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/conversation", conversationRoute);

export default router;
