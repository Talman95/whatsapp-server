import mongoose, {InferSchemaType, model, Schema} from "mongoose";

const ChatSchema = new Schema({
        chatName: {type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }, {
        timestamps: true
    }
)

export type Chat = InferSchemaType<typeof ChatSchema>

export default model<Chat>('Chat', ChatSchema)