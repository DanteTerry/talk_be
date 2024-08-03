import express from "express";
import authRoute from "./auth.route.js";
import conversationRoute from "./conversation.route.js";
import messageRoute from "./message.route.js";
import userRoute from "./user.route.js";
import translateRoute from "./translate.route.js";
import languageRoute from "./language.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/conversation", conversationRoute);
router.use("/message", messageRoute);
router.use("/translate", translateRoute);
router.use("/language", languageRoute);

export default router;
