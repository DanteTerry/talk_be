import createHttpError from "http-errors";
import logger from "../configs/logger.js";
import {
  createConversation,
  doesConversationExists,
  getUserConversations,
  populateConversation,
} from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const createOpenConversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;

    // check if reviver id is provided
    if (isGroup === false) {
      if (!receiver_id) {
        logger.error(
          "please provide the user id you want to start conversation with"
        );
        throw createHttpError.BadGateway("Something went wrong");
      }

      // check if chat exists
      const existed_conversation = await doesConversationExists(
        sender_id,
        receiver_id,
        false
      );

      if (existed_conversation) {
        res.json(existed_conversation);
      } else {
        let receiver_user = await findUser(receiver_id);
        let conversationData = {
          name: "conversation name",
          picture: "conversation picture",
          isGroup: false,
          users: [sender_id, receiver_id],
        };

        const newConversation = await createConversation(conversationData);

        const populatedConversation = await populateConversation(
          newConversation._id,
          "users",
          "-password"
        );
        return res.status(200).json(populatedConversation);
      }
    } else {
      console.log("group exists");
    }
  } catch (error) {
    // check if group chat exists
    const is_group_chat_exists = await doesConversationExists("", "", isGroup);

    if (is_group_chat_exists._id) {
      res.status(200).json(is_group_chat_exists);
    }
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);

    return res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
export const createGroup = async (req, res, next) => {
  const { name, users } = req.body;
  //add current user to users

  users.push(req.user.userId);
  if (!name || !users) {
    throw createHttpError.BadRequest("Please fill all fields");
  }

  if (users.length < 2) {
    throw createHttpError.BadRequest(
      "Please add at least 2 users to create group"
    );
  }

  const conversationData = {
    name,
    users,
    isGroup: true,
    admin: req.user.userId,
    picture: process.env.DEFAULT_GROUP_PICTURE,
  };

  try {
    const newConversation = await createConversation(conversationData);

    const populateConversations = await populateConversation(
      newConversation._id,
      "users admin",
      "-password"
    );

    console.log(populateConversations);

    res.status(200).json(populateConversations);
  } catch (error) {
    next(error);
  }
};
