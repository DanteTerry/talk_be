import createHttpError from "http-errors";
import UserModel from "../models/userModel.js";
import ConversationModel from "../models/conversationModel.js";

export const doesConversationExists = async (sender_Id, receiver_id) => {
  let conversations = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_Id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!conversations) {
    throw createHttpError.BadGateway("oops something went wrong !");
  }

  //   populate message model
  conversations = await UserModel.populate(conversations, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return conversations[0];
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation)
    throw new createHttpError.BadGateway("Oops something went wrong!");
  return newConversation;
};

export const populateConversation = async (
  id,
  fieldsToPopulate,
  fieldsToRemove
) => {
  const populatedConversation = await ConversationModel.findOne({
    _id: id,
  }).populate(fieldsToPopulate, fieldsToRemove);

  if (!populatedConversation) {
    throw createHttpError.BadGateway("Oops something went wrong");
  }

  return populatedConversation;
};

export const getUserConversations = async (user_id) => {
  let userConversation;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      userConversation = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest("Oops something went wrong!");
    });

  return userConversation;
};
