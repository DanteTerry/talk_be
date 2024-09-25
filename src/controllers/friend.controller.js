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

export const removeFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;

    // Validate input
    if (!userId || !friendId) {
      throw createHttpError.BadRequest("User ID and Friend ID are required.");
    }

    // Check if both users exist
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!user || !friend) {
      throw createHttpError.NotFound("User or Friend not found.");
    }

    // Check user's friends list
    let userFriends = await Friends.findOne({ user: userId });
    let friendFriends = await Friends.findOne({ user: friendId });

    // Check if the user is already friends with the specified friend
    if (!userFriends || !userFriends.friends.includes(friendId)) {
      throw createHttpError.Conflict("This user is not in your friend list.");
    }

    // Check if the friend has the user in their friends list
    if (!friendFriends || !friendFriends.friends.includes(userId)) {
      throw createHttpError.Conflict("This user is not in your friend's list.");
    }

    // Remove friend from user's friends list
    await Friends.updateOne({ user: userId }, { $pull: { friends: friendId } });

    // Remove user from friend's friends list
    await Friends.updateOne({ user: friendId }, { $pull: { friends: userId } });

    res.status(200).json({
      success: true,
      message: "Friend removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
