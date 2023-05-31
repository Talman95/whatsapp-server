import dotenv from 'dotenv'

dotenv.config()

const MONGO_URL = process.env.DB_URL

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
}
