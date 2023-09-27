import express from "express";
import {
  changeMessageText,
  createNewMessage,
  deleteMessage,
  getMessages,
  getUnreadMessagesFromOneUser,
} from "../controllers/chatController";

const router = express.Router();

router.get("/messages", getMessages);
router.get("/unread_messages/:userId", getUnreadMessagesFromOneUser);
router.post("/new_message", createNewMessage);
router.delete("/delete_message/:id", deleteMessage);
router.patch("/change_message/:id", changeMessageText);

export default router;
