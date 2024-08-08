import createHttpError from "http-errors";
import Friends from "../models/friends.Model.js";
import UserModel from "../models/userModel.js";

// get friends from database
export const getFriends = async (req, res, next) => {
  try {
    const userId = req.query.id;

    const friendsList = await Friends.findOne({ user: userId })
      .populate({
        path: "friends",
        select: "name email picture status",
        model: "User",
      })
      .exec();

    if (!friendsList) {
      throw createHttpError.BadRequest("No friends found for the user.");
    }

    res.status(200).json({
      success: true,
      friends: friendsList.friends,
    });
  } catch (error) {
    next(error);
  }
};

// add friends to database
export const addFriends = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      throw createHttpError.BadRequest("User ID, Friend ID are required.");
    }

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!user || !friend) {
      throw createHttpError.NotFound("User or Friend not found.");
    }

    let userFriends = await Friends.findOne({ user: userId });
    let friendFriends = await Friends.findOne({ user: friendId });

    if (userFriends && userFriends.friends.includes(friendId)) {
      throw createHttpError.Conflict(
        "This user is already in your friend list."
      );
    }

    if (friendFriends && friendFriends.friends.includes(userId)) {
      throw createHttpError.Conflict(
        "This user is already in your friend list."
      );
    }

    if (!userFriends) {
      userFriends = await Friends.create({
        user: userId,
        friends: [friendId],
      });
    } else {
      await Friends.updateOne(
        { user: userId },
        { $push: { friends: friendId } }
      );
    }

    if (!friendFriends) {
      friendFriends = await Friends.create({
        user: friendId,
        friends: [userId],
      });
    } else {
      await Friends.updateOne(
        { user: friendId },
        { $push: { friends: userId } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Friend added successfully.",
    });
  } catch (error) {
    next(error);
  }
};
