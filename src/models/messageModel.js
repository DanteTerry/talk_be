import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      trim: true,
    },

    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },

    files: [],
  },
  { timestamps: true, collection: "messages" }
);

const MessageModel = mongoose.models.Message || model("Message", messageSchema);

export default MessageModel;
