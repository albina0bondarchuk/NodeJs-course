import express from "express";
import { chatsController } from "../../controllers/secured";

const chatsRouter = express.Router();

chatsRouter.get("/", chatsController.getChats);
chatsRouter.post("/", chatsController.createNewChat);
chatsRouter.delete("/:id", chatsController.deleteChat);
chatsRouter.patch("/:id", chatsController.changeChat);

export default chatsRouter;
