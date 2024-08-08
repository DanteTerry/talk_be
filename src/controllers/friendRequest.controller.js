import createHttpError from "http-errors";
import FriendRequest from "../models/friendRequest.Model.js";
import UserModel from "../models/userModel.js";

export const getFriendRequest = async (req, res, next) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      throw createHttpError.BadRequest("User ID is required.");
    }

    const friendRequests = await FriendRequest.find({
      $or: [{ receiver: userId }, { sender: userId }],
    })
      .populate("sender", "name email picture")
      .populate("receiver", "name email picture");

    if (!friendRequests) {
      throw createHttpError.NotFound("No friend requests found for this user.");
    }

    res.status(200).json({
      success: true,
      friendRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const addFriendRequest = async (req, res, next) => {
  try {
    const { sender, receiver } = req.body;

    if (!sender || !receiver) {
      throw createHttpError.BadRequest("Sender and receiver IDs are required.");
    }

    if (sender === receiver) {
      throw createHttpError.BadRequest(
        "Sender and receiver cannot be the same."
      );
    }

    const senderUser = await UserModel.findById(sender);
    const receiverUser = await UserModel.findById(receiver);

    if (!senderUser || !receiverUser) {
      throw createHttpError.NotFound("Sender or receiver not found.");
    }

    const existingRequest = await FriendRequest.findOne({
      sender,
      receiver,
    });

    if (existingRequest) {
      throw createHttpError.Conflict(
        "A friend request already exists between these users."
      );
    }

    const newRequest = await FriendRequest.create({
      sender,
      receiver,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
      request: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// changing friendRequest status
export const changeStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      throw createHttpError.BadRequest(
        "Friend request ID and status are required."
      );
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      throw createHttpError.BadRequest("Invalid status value.");
    }

    const friendRequest = await FriendRequest.findById(id);

    if (!friendRequest) {
      throw createHttpError.NotFound("Friend request not found.");
    }

    const updatedRequest = await FriendRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Friend request status updated successfully.",
      request: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};
