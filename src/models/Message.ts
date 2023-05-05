import mongoose, {InferSchemaType, model, Schema} from "mongoose";

const MessageSchema = new Schema({
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        content: {type: String, trim: true},
        chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    }, {
        timestamps: true
    }
)

export type Message = InferSchemaType<typeof MessageSchema>

export default model<Message>('Message', MessageSchema)