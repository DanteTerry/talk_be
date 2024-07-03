import mongoose, { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation name is required"],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },

    isGroup: {
      type: Boolean,
      require: true,
      default: false,
    },

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true, collection: "conversation" }
);

const ConversationModel =
  mongoose.models.Conversation || model("Conversation", conversationSchema);

export default ConversationModel;
