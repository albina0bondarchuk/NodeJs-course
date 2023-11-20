import express from "express";
import { loginController } from "../../controllers/public";

const loginRouter = express.Router();

loginRouter.post("/login", loginController.login);
loginRouter.post("/refresh_token", loginController.refreshToken)

export default loginRouter;
