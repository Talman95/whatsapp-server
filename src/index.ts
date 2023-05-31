import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { userRoutes } from './routes/user.routes'
import { chatRoutes } from './routes/chat.routes'
import { messageRoutes } from './routes/message.routes'
import { config } from './config/config'

const app = express()

mongoose
  .connect(config.mongo.url!, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Mongo connected successfully.')
  })
  .catch(error => console.error(error))

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/** Routes */

app.use('/auth', userRoutes)
app.use('/chats', chatRoutes)
app.use('/messages', messageRoutes)

/** Error handling */
app.use((req, res, next) => {
  const error = new Error('Not found')

  console.error(error)

  res.status(404).json({
    message: error.message,
  })
})

const server = app.listen(config.server.port, () => {
  console.log(`Example app listening on port ${config.server.port}`)
})

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('setup', userData => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', room => {
    socket.join(room)
    console.log('Rooms:', room)
  })

  socket.on('typing', room => {
    socket.to(room).emit('typing')
  })

  socket.on('stop typing', room => {
    socket.to(room).emit('stop typing')
  })

  socket.on('new message', (room, newMessage) => {
    socket.to(room).emit('message received', newMessage)
  })

  socket.on('leave chat', room => {
    socket.leave(room)
  })
})
