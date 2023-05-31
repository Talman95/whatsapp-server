import { Request, Response } from 'express'
import Message from '../models/Message'
import User from '../models/User'
import Chat from '../models/Chat'

export const messageController = {
  fetchAllMessages: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId

      const messages = await Message.find({ chat: chatId })
        .populate('sender', 'fullName avatarUrl email')
        .populate('chat')

      res.json(messages)
    } catch (e) {
      res.status(400)
      res.send('Неизвестная ошибка')
    }
  },
  sendMessage: async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.userId

      const { content, chatId } = req.body

      if (!content || !chatId) {
        return res.status(404).send('Данные не правильные')
      }

      const newMessage = {
        sender: userId,
        content,
        chat: chatId,
      }

      let message = await Message.create(newMessage)

      message = await message.populate('sender', 'fullName avatarUrl')
      message = await message.populate('chat')

      message = (await User.populate(message, {
        path: 'chat.users',
        select: 'fullName avatarUrl email',
      })) as any

      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message,
      })

      res.json(message)
    } catch (e) {
      res.status(400)
      res.send('Неизвестная ошибка')
    }
  },
}
