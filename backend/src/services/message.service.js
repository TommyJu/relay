import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getSocketIdFromUserId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import { throwError } from "../utils/errorHandling.js";
import { MAX_MESSAGE_LENGTH } from "../../../shared/message.constants.js";
import mongoose from "mongoose";

export const getSidebarUsers = async (loggedInUserId) => {
  const loggedInUser = await User.findById(loggedInUserId)
    .select("pinnedUsers");

  const pinnedUsers = await User.find({
    _id: { $in: loggedInUser.pinnedUsers }
  }).select("-password"); // Omit passwords for security reasons

  const otherUsers = await User.find({
    _id: {
      $nin: [...loggedInUser.pinnedUsers, loggedInUserId]
    }
  }).select("-password"); // Omit passwords

  return { pinnedUsers, otherUsers };
};

export const addToPinnedUsers = async (loggedInUserId, userToAddId) => {
  if (!mongoose.Types.ObjectId.isValid(userToAddId)) {
    throwError("Invalid user id", 400);
  }

  if (loggedInUserId.equals(userToAddId)) {
    throwError("You cannot pin yourself", 400);
  }
  
  return await User.findByIdAndUpdate(
    loggedInUserId,
    { $addToSet: { pinnedUsers: userToAddId } },
    { new: true }
  );
};

export const removeFromPinnedUsers = async (loggedInUserId, userToRemoveId) => {
  return await User.findByIdAndUpdate(
    loggedInUserId,
    { $pull: { pinnedUsers: userToRemoveId } },
    { new: true }
  );
};

export const findMessagesSentAndReceived = async (senderId, receiverId) => {
  return await Message.find({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });
};

export const uploadChatImage = async (image) => {
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    return uploadResponse.secure_url;
  }
};

export const createAndSaveMessage = async (
  senderId,
  receiverId,
  text,
  imageURL
) => {
  if (text.length > MAX_MESSAGE_LENGTH) {
    throwError(
      `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`,
      400
    );
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageURL,
  });

  await newMessage.save();
  return newMessage;
};

export const emitNewMessageEvent = (receiverId, newMessage) => {
  const receiverSocketId = getSocketIdFromUserId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
};
