import { Router } from 'express'
import { messageController } from '../controllers/message.controller'
import checkAuth from '../middlewares/checkAuth'

export const messageRoutes = Router()

messageRoutes.post('/', checkAuth, messageController.sendMessage)
messageRoutes.get('/:chatId', checkAuth, messageController.fetchAllMessages)
