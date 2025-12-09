import User from "../models/user.model"

export const getUsersForSidebar = async (req, res) => {
    try {
        // Retrieves all users except for the user that is currently logged in.
        const loggedInUserId = req.user._id;
        const otherUsers = await User.find({ _id: { $ne:loggedInUserId } }).select("-password");

        res.status(200).json(otherUsers);
    } catch (error) {
        console.error("Error in message controller get users for sidebar function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};