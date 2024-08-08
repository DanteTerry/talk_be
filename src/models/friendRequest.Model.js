import mongoose, { Schema, model } from "mongoose";

const friendRequestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender's information is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver's information is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "friendRequests" }
);

const FriendRequest =
  mongoose.models.FriendRequest || model("FriendRequest", friendRequestSchema);

export default FriendRequest;
