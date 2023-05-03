import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose"

import { userRouter } from './routes/user-router'

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cors())

async function start() {
    try {
        await mongoose.connect(process.env.DB_URL!)

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (err) {
        console.log('Server error', err)
    }
}

start()

app.use('/auth', userRouter)