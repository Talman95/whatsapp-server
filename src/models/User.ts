import mongoose, { model, InferSchemaType, Document, Schema } from 'mongoose'

export interface User {
  email: string
  fullName: string
  passwordHash: string
  avatarUrl: string
  token?: string
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<UserModel>('User', UserSchema)
