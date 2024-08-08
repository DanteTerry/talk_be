import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addLanguage,
  changeLanguage,
} from "../controllers/language.controller.js";

const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, addLanguage);
router.route("/").patch(trimRequest.all, authMiddleware, changeLanguage);

export default router;
