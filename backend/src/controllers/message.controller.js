import { sendErrorResponse } from "../utils/errorHandling.js";
import {
  getOtherUsers,
  findMessagesSentAndReceived,
  uploadChatImage,
  createAndSaveMessage,
  emitNewMessageEvent,
  removeFromPinnedUsers,
  addToPinnedUsers,
} from "../services/message.service.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const otherUsers = await getOtherUsers(loggedInUserId);
    res.status(200).json(otherUsers);
  } catch (error) {
    sendErrorResponse(res, error, "message controller get users for sidebar");
  }
};

export const pinUserToSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { userToAddId } = req.params;

    const updatedUser = await addToPinnedUsers(loggedInUserId, userToAddId);
    res.status(200).json(updatedUser);
  } catch (error) {
    sendErrorResponse(res, error, "message controller pin user to sidebar");
  }
};

export const unpinUserFromSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { userToRemoveId } = req.params;

    const updatedUser = await removeFromPinnedUsers(
      loggedInUserId,
      userToRemoveId
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    sendErrorResponse(res, error, "message controller unpin user to sidebar");
  }
};

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await findMessagesSentAndReceived(senderId, receiverId);

    res.status(200).json(messages);
  } catch (error) {
    sendErrorResponse(res, error, "message controller get messages");
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Image uploads are optional
    let imageURL = (await uploadChatImage(image)) || "";

    const newMessage = await createAndSaveMessage(
      senderId,
      receiverId,
      text,
      imageURL
    );

    emitNewMessageEvent(receiverId, newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    sendErrorResponse(res, error, "message controller send message");
  }
};
