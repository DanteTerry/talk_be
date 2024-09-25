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

    // Validate that sender and receiver IDs are provided
    if (!sender || !receiver) {
      throw createHttpError.BadRequest("Sender and receiver IDs are required.");
    }

    // Prevent users from sending requests to themselves
    if (sender === receiver) {
      throw createHttpError.BadRequest(
        "Sender and receiver cannot be the same."
      );
    }

    // Ensure that both sender and receiver exist in the system
    const [senderUser, receiverUser] = await Promise.all([
      UserModel.findById(sender),
      UserModel.findById(receiver),
    ]);

    if (!senderUser || !receiverUser) {
      throw createHttpError.NotFound("Sender or receiver not found.");
    }

    // Check if a friend request already exists between these users
    const existingRequest = await FriendRequest.findOne({ sender, receiver });

    // If the request was previously rejected, update the status back to pending
    if (
      existingRequest &&
      (existingRequest.status === "rejected" ||
        existingRequest.status === "accepted")
    ) {
      existingRequest.status = "pending";
      await existingRequest.save();

      return res.status(200).json({
        success: true,
        message: "Friend request sent again.",
        request: existingRequest,
      });
    }

    // If no previous request or rejected request, create a new friend request
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
