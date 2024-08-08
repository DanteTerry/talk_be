import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addFriendRequest,
  changeStatus,
  getFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.route("/").get(trimRequest.all, getFriendRequest);
router.route("/").post(trimRequest.all, addFriendRequest);
router.route("/").patch(trimRequest.all, changeStatus);

export default router;
