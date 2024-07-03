import createHttpError from "http-errors";
import UserModel from "../models/userModel.js";

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw createHttpError.BadGateway("Please fill all fields");
  }
  return user;
};

export const searchUser = async (keyword, userId) => {
  try {
    const users = await UserModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    })
      .find({ _id: { $ne: userId } })
      .select("-password");

    return users;
  } catch (error) {
    console.log(error);
    throw createHttpError("Something went wrong");
  }
};
