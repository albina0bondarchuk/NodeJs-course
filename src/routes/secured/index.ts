import express from 'express'
import messagesRouter from './messages'
import chatsRouter from './chats'

const securedRouter = express.Router()
securedRouter.use('/messages', messagesRouter)
securedRouter.use('/chats', chatsRouter)

export default securedRouter
