import {Router} from "express";
import checkAuth from "../middlewares/checkAuth";
import {chatController} from "../controllers/chat-controller";

export const chatRouter = Router()

chatRouter.get('/', checkAuth, chatController.fetchChats)