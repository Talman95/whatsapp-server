import { Router } from 'express'
import checkAuth from '../middlewares/checkAuth'
import { chatController } from '../controllers/chat.controller'

export const chatRoutes = Router()

chatRoutes.get('/', checkAuth, chatController.fetchChats)
chatRoutes.post('/', checkAuth, chatController.accessChat)
