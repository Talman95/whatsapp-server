import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose"
import { Server } from "socket.io"

import { userRouter } from './routes/user-router'
import { chatRouter } from "./routes/chat-router";
import { messageRouter } from "./routes/message-router";

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
                console.log('Rooms:', room);
            })

            socket.on('typing', (room) => {
                socket.to(room).emit('typing')
            })

            socket.on('stop typing', (room) => {
                socket.to(room).emit('stop typing')
            })

            socket.on('new message', (room, newMessage) => {
                socket.to(room).emit('message received', newMessage)
            })

            socket.on('leave chat', (room) => {
                socket.leave(room)
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
