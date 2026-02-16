import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface"


const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },
  isActive: {
    type: Boolean,
    default: true
  }

},
  {
    timestamps: true
  })

export const User = model<IUser>("User", userSchema)