import express from 'express'
import { messagesController } from '../../controllers/secured'

const messagesRouter = express.Router()

messagesRouter.get('/', messagesController.getMessages)
messagesRouter.post('/', messagesController.createNewMessage)
messagesRouter.delete('/:id', messagesController.deleteMessage)
messagesRouter.patch('/:id', messagesController.changeMessageText)

export default messagesRouter
