import mongoose, { Schema, model } from "mongoose";

const languageSchema = new Schema(
  {
    language: {
      type: String,
      trim: true,
      require: [true, "Please provide user's language"],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "language",
  }
);

const LanguageModel =
  mongoose.models.Language || model("Language", languageSchema);

export default LanguageModel;
