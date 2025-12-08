import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Verifies the JWT, loads the user into the request body, and passes control to the next middleware.
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieves the token from the client.
        const token = req.cookies.jwt;

        // Verifies that the client token exists.
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided." });
        };

        // Verifies that the token is valid and has not been tampered with.
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized, invalid token." });
        };

        const user = await User.findById(decodedToken.userId).select("-password");

        // Verifies that the user exists.
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        };

        // Adds the user to the request body for the next middleware function.
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};