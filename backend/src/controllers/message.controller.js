import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

// Retrieves all users except for the user that is currently logged in.
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


// Gets messages between the current user and message recipient.
export const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const currentUserId = req.user._id;
        
        // Retrieves both incoming and outgoing messages.
        const messages = await Message.find({ 
            $or: [
                {
                    senderId: senderId,
                    receiverId: userToChatId
                },
                {
                    receiverId: userToChatId,
                    senderId: senderId
                }
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in message controller get messages function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Sends a message to another user by creating a new message in the database.
export const sendMessage = async (req, res) => {
    try {
        // Retrieves data from the request
        const { text, image } = req.body;
        const {recipientId} = req.params;
        const currentUserId = req.user._id;

        // Uploads an optional image to Cloudinary.
        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Creates a new message to be sent.
        const newMessage = new Message({
            currentUserId,
            recipientId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        res(201).json(newMessage);

    } catch (error) {
        console.error("Error in message controller send message function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};
