import mongoose, { Schema } from 'mongoose'

export interface Message {
  sender: string
  content: string
  chat: string
  readBy: string
}

export interface MessageModel extends Message, Document {}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<MessageModel>('Message', MessageSchema)
