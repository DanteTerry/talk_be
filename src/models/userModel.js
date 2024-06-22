import { Schema, model, models } from "mongoose";
import validator from "validator";

const userSchema = Schema(
  {
    name: {
      type: String,
      require: [true, "Please provide your name"],
    },

    email: {
      type: String,
      require: [true, "Please provide your email"],
      unique: [true, "This email already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/bitway/image/upload/v1719086533/whatsapp/ae12ays5udjiwp9cw8ll.svg",
    },

    status: {
      type: String,
      default: "Hey there! I am using WhatsApp.",
    },

    password: {
      type: String,
      require: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      maxLength: [128, "Password must not be more than 20 characters"],
    },
  },
  { collection: "users", timestamps: true }
);

const UserModel = models.UserModel || model("User", userSchema);

export default UserModel;
