import mongoose, { Schema } from 'mongoose'

export interface Chat {
  chatName: string
  isGroupChat: boolean
  users: string[]
  latestMessage: string
  groupAdmin: string
}

export interface ChatModel extends Chat, Document {}

const ChatSchema: Schema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ChatModel>('Chat', ChatSchema)
