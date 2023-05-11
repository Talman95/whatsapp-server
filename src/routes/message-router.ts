import {Router} from "express";
import {messageController} from "../controllers/message-controller";
import checkAuth from "../middlewares/checkAuth";

export const messageRouter = Router()

messageRouter.post('/', checkAuth, messageController.sendMessage)
messageRouter.get('/:chatId', checkAuth, messageController.fetchAllMessages)