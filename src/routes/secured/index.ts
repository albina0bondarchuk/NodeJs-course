import express from "express";
import messagesRouter from "./messages";
import chatsRouter from "./chats";
import userRouter from "./user";

const securedRouter = express.Router();
securedRouter.use("/messages", messagesRouter);
securedRouter.use("/chats", chatsRouter);
securedRouter.use("/user", userRouter);

export default securedRouter;
