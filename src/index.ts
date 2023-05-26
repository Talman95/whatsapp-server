import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose"
import { Server } from "socket.io"

import { userRouter } from './routes/user-router'
import { chatRouter } from "./routes/chat-router";
import { messageRouter } from "./routes/message-router";
import { IUser } from "./models/User";

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cors())

async function start() {
    try {
        await mongoose.connect(process.env.DB_URL!)

        const server = app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })

        const io = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: '*',
            },
        });

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('setup', (userData) => {
                socket.join(userData._id)
                socket.emit('connected')
            })

            socket.on('join chat', (room) => {
                socket.join(room)
                console.log('Room', room);
            })

            socket.on('new message', (newMessagesReceived) => {
                const chat = newMessagesReceived.chat

                if (!chat.users) return console.log('chat.users not found')

                chat.users.forEach((user: IUser & {_id: string}) => {
                    if (user._id === newMessagesReceived.sender._id) return

                    socket.in(user._id).emit('message received', newMessagesReceived)
                })

            })
        });

    } catch (err) {
        console.log('Server error', err)
    }
}

start()

app.use('/auth', userRouter)
app.use('/chats', chatRouter)
app.use('/messages', messageRouter)
