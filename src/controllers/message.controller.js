import logger from "../configs/logger.js";
import {
  createMessage,
  getConversationMessages,
  populateMessage,
  updateLatestMessage,
} from "../services/message.service.js";
import { translate } from "bing-translate-api";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;

    const { message, conversation_id, files } = req.body;
    if (!conversation_id || (!message && !files)) {
      logger.error("Please provide a conversation id and message body");
      return res.sendStatus(400);
    }

    const messageData = {
      sender: user_id,
      message,
      conversation: conversation_id,
      files: files || [],
    };

    let newMessage = await createMessage(messageData);
    let populatedMessage = await populateMessage(newMessage._id);
    await updateLatestMessage(conversation_id, newMessage);

    return res.json(populatedMessage);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const translateMessage = async (messages, lang) => {
  try {
    // Process all translations in parallel using Promise.all
    const translatedMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          // If message is a Mongoose document, convert it to a plain object
          if (message.toObject) {
            message = message.toObject();
          }

          // Translate the message text
          const res = await translate(message.message, null, lang || "en");
          message.message = res?.translation; // Update the message text with the translated text

          return message; // Return the modified message object
        } catch (error) {
          console.error(`Error translating message: ${message.message}`, error);
          return message; // Return the original message in case of an error
        }
      })
    );

    return translatedMessages; // Return the array of translated messages
  } catch (error) {
    console.error("Error in translating messages:", error);
    throw error; // Rethrow to allow handling in calling context
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const conversation_id = req.params.conversation_id;
    const page = req.query.page;
    const limit = 30;
    const skip = (page - 1) * limit;
    const lang = req.query.lang;

    if (!conversation_id) {
      logger.error("Please add a conversation id in params");
      res.status(400);
    }

    const messages = await getConversationMessages(
      conversation_id,
      limit,
      skip
    );

    const updatedMessage = await translateMessage(messages, lang);

    return res.json(updatedMessage);
  } catch (error) {
    next(error);
  }
};
