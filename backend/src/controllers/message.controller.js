import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getSocketIdFromUserId } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUsers = await User.find({ _id: { $ne:loggedInUserId } }).select("-password");

        res.status(200).json(otherUsers);
    } catch (error) {
        console.error("Error in message controller get users for sidebar function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;
        
        // Retrieves both incoming and outgoing messages.
        const messages = await Message.find({ 
            $or: [
                {
                    senderId,
                    receiverId
                },
                {
                    receiverId,
                    senderId
                }
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in message controller get messages function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { receiverId } = req.params;
        const currentUserId = req.user._id;

        // Image uploads are optional
        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: currentUserId,
            receiverId: receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        const receiverSocketId = getSocketIdFromUserId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        };
        
        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in message controller send message function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};
