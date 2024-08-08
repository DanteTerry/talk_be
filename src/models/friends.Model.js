import mongoose, { Schema, model } from "mongoose";

const friendsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User's information is required"],
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide friends id to add to friend list"],
      },
    ],
    status: {
      type: String,
    },
  },
  { timestamps: true, collection: "friends" }
);

const Friends = mongoose.models.Friends || model("Friends", friendsSchema);

export default Friends;
