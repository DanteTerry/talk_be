import createHttpError from "http-errors";
import logger from "../configs/logger.js";
import { searchUser } from "../services/user.service.js";

export const findUser = async (req, res, next) => {
  try {
    const keyword = req.query.search;

    if (!keyword) {
      logger.error("Please add a search query first");
      throw createHttpError.BadRequest("Oops something went wrong");
    }
    const users = await searchUser(keyword, req.user.userId);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
