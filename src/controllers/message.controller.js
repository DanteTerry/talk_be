import logger from "../configs/logger.js";
import {
  createMessage,
  getConversationMessages,
  populateMessage,
  updateLatestMessage,
} from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;

    const { message, conversation_id, files } = req.body;
    if (!conversation_id || (!message && !files)) {
      logger.error("Please provide a conversation id and message body");
      return res.send(400);
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
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const conversation_id = req.params.conversation_id;
    console.log(conversation_id);

    if (!conversation_id) {
      logger.error("Please add a conversation id in params");
      res.status(400);
    }

    const messages = await getConversationMessages(conversation_id);
    return res.json(messages);
  } catch (error) {
    next(error);
  }
};
