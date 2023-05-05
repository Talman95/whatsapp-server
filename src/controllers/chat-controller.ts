import {Request, Response} from "express";
import Chat from "../models/Chat";
import User from "../models/User";

export const chatController = {
    fetchChats: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const authUserId = req.userId

            const chats = await Chat.find({users: {$elemMatch: {$eq: authUserId}}})
                .populate('users', '-passwordHash')
                .populate('groupAdmin', '-passwordHash')
                .populate('latestMessage')
                .sort({updatedAt: -1})

            const results = await User.populate(chats, {
                path: 'latestMessage.sender',
                select: 'fullName, avatarUrl email',
            })

            res.status(200).send(results)
        } catch (e) {
            res.status(404).json({
                message: 'Нет доступа'
            })
        }
    },
    accessChat: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const authUserId = req.userId
            const {userId} = req.body

            if (!userId) {
                return res.status(404).send('Пользователь не найден')
            }

            const isChat = await Chat.find({
                isGroupChat: false,
                $and: [
                    {users: {$elemMatch: {$eq: authUserId}}},
                    {users: {$elemMatch: {$eq: userId}}},
                ]
            }).populate('users', '-passwordHash')
                .populate('latestMessage')

            const result = await User.populate(isChat, {
                path: 'latestMessage.sender',
                select: 'fullName, avatarUrl email',
            }) as any[]

            if (result.length > 0) {
                res.send(result[0])
            } else {
                const newChat = {
                    chatName: 'sender',
                    isGroupChat: false,
                    users: [authUserId, userId]
                }

                const createdChat = await Chat.create(newChat)

                const fullChat = await Chat.findOne({_id: createdChat._id})
                    .populate('users', '-password')

                res.status(200).send(fullChat)

            }
        } catch (e) {
            res.status(404).json({
                message: 'Что-то пошло не так'
            })
        }
    },
}