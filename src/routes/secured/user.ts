import express from 'express'
import { messagesController, userController } from '../../controllers/secured'

const userRouter = express.Router()

userRouter.get('/', userController.getUser)

export default userRouter