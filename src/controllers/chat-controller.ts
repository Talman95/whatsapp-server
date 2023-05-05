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
}