import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  pinUserToSidebar,
  unpinUserFromSidebar,
  getConversation,
  markConversationAsRead
} from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users/sidebar", protectRoute, getUsersForSidebar);
router.put("/users/pin-user/:userToAddId", protectRoute, pinUserToSidebar);
router.delete("/users/unpin-user/:userToRemoveId", protectRoute, unpinUserFromSidebar);

router.get("/chat/:receiverId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, sendMessage);

router.post("/conversation/:otherUserId", protectRoute, getConversation);
router.put("/conversation/mark-as-read/:conversationId", protectRoute, markConversationAsRead)

export default router;
