import express from "express";
import { registrationController } from "../../controllers/public";

const registrationRouter = express.Router();

registrationRouter.post("/", registrationController.registration);

export default registrationRouter;