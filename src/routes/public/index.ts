import express from "express";
import loginRouter from "./login";
import registrationRouter from "./registration";

const publicRouter = express.Router();
publicRouter.use("/login", loginRouter);
publicRouter.use("/registration", registrationRouter);

export default publicRouter;
