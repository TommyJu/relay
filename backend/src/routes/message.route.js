import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

// Defines routes for user messaging
const router = express.Router();

// Defines a route for getting users for the sidebar menu.
router.get("/users", protectRoute, getUsersForSidebar);

// Defines a route for getting messages between the current user and recipient
router.get("/:recipientId", protectRoute, getMessages);

// Defines a route for sending a message to another user.
router.post("/send/:recipientId", protectRoute, sendMessage);

export default router;
