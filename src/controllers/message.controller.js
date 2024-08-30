import {
  createMessage,
  getConversationMessages,
  populateMessage,
  updateLatestMessage,
} from "../services/message.service.js";

import { translate } from "bing-translate-api";
import LanguageModel from "../models/language.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { message, conversation_id, files, otherUserId } = req.body;
    const page = 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    // Validate input
    if (!conversation_id || (!message && !files)) {
      console.error("Please provide a conversation id and message body");
      return res.sendStatus(400);
    }

    // Get user languages
    const user = await LanguageModel.findOne({ user: user_id });
    const otherUser = await LanguageModel.findOne({ user: otherUserId });
    const userLang = user.language;
    const otherUserLang = otherUser.language;
    const languages = [userLang, otherUserLang];

    // Prepare message data
    const messageData = {
      sender: user_id,
      message,
      conversation: conversation_id,
      files: files || [],
    };

    // Create new message and populate with necessary data
    const newMessage = await createMessage(messageData);
    const populatedMessage = await populateMessage(newMessage._id);

    // Update latest message in conversation
    await updateLatestMessage(conversation_id, newMessage);

    // Return the new message
    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    next(error);
  }
};
export const translateMessage = async (messages, lang) => {
  try {
    const translatedMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          if (message.toObject) {
            message = message.toObject();
          }
          const res = await translate(message.message, null, lang);
          message.message = res?.translation;
          return message;
        } catch (error) {
          console.error(`Error translating message: ${message.message}`, error);
          return message;
        }
      })
    );

    return translatedMessages;
  } catch (error) {
    console.error("Error in translating messages:", error);
    throw error;
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    let { page, lang } = req.query;
    const limit = 30;
    const skip = (page - 1) * limit;

    if (!conversation_id) {
      return res
        .status(400)
        .json({ message: "Please add a conversation id in params" });
    }

    const messages = await getConversationMessages(
      conversation_id,
      limit,
      skip
    );

    const translatedMessage = await translateMessage(messages, lang);

    return res.status(200).json(translatedMessage);
  } catch (error) {
    next(error);
  }
};
