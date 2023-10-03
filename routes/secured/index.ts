import express from "express";
import messagesRouter from "./messages";

const router = express.Router();
router.use("/messages", messagesRouter);

export default router;
