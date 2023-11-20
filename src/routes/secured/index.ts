import express from "express";
import { expressjwt } from "express-jwt";
import messagesRouter from "./messages";
import chatsRouter from "./chats";

const securedRouter = express.Router();
securedRouter.use("/messages", messagesRouter);
securedRouter.use("/chats", chatsRouter);

export default securedRouter;
