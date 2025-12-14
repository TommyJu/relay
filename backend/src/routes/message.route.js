import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:recipientId", protectRoute, getMessages);
router.post("/send/:recipientId", protectRoute, sendMessage);

export default router;
