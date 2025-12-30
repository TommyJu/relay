import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  pinUserToSidebar,
  unpinUserFromSidebar
} from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:receiverId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, sendMessage);
router.put("/users/pin-user/:userToAddId", protectRoute, pinUserToSidebar);
router.delete("/users/unpin-user/:userToRemoveId", protectRoute, unpinUserFromSidebar);

export default router;
