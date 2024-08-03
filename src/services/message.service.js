import createHttpError from "http-errors";
import MessageModel from "../models/messageModel.js";
import ConversationModel from "../models/conversationModel.js";
import redis from "../redisClient.js";

export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);

  if (!newMessage) {
    throw createHttpError.BadRequest("Oops something went wrong");
  }

  return newMessage;
};

export const populateMessage = async (id) => {
  let message = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "User",
      },
    });

  if (!message) {
    throw createHttpError.BadRequest("Oops something went wrong");
  }

  return message;
};

export const updateLatestMessage = async (conversation_id, message) => {
  const updatedConversation = await ConversationModel.findByIdAndUpdate(
    conversation_id,
    {
      latestMessage: message,
    }
  );

  if (!updatedConversation) {
    throw createHttpError.BadRequest("Oops something went wrong");
  }

  return updatedConversation;
};

export const getConversationMessages = async (conversation_id, limit, skip) => {
  const messages = await MessageModel.find({
    conversation: conversation_id,
  })
    .populate("sender", "name picture email status")
    .populate("conversation")
    .sort({ createdAt: -1 })
    .limit(20);

  if (!messages) {
    throw createHttpError.BadRequest("Oops something went wrong");
  }

  return messages;
};
