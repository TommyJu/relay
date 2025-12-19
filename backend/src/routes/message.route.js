import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:receiverId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, sendMessage);

export default router;
