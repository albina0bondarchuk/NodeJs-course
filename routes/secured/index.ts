import express from "express";
import messagesRouter from "./messages";

const securedRouter = express.Router();
securedRouter.use("/messages", messagesRouter);

export default securedRouter;
