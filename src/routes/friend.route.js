import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addFriends,
  getFriends,
  removeFriend,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.route("/").get(trimRequest.all, authMiddleware, getFriends);
router.route("/").post(trimRequest.all, authMiddleware, addFriends);
router
  .route("/removeFriend")
  .post(trimRequest.all, authMiddleware, removeFriend);

export default router;
