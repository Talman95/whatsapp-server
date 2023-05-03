import { model, InferSchemaType, Document, Schema } from 'mongoose'

export interface IUser extends Document {
    email: string,
    fullName: string,
    passwordHash: string,
    avatarUrl: string,
    token?: string,
    createdAt: Date,
    updatedAt: Date,
}

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
})

export type User = InferSchemaType<typeof UserSchema>

export default model<User>('User', UserSchema)