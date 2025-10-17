import mongoose, { Schema } from "mongoose";
import { User } from "../types/usersTypes";


const UserSchema: Schema = new Schema<User>(
  {
    name: { type: String, required: false },
    balance: { type: Number, required: false, default: 0 },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: false,
    },
    validatedTeacher: { type: Boolean, default: false },
    phone: { type: String },
    location: {
      city: { type: String, required: false },
      country: { type: String, required: false },
    },
    subjects: [
      {
        name: { type: String, required: false },
        educationLevel: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],
    availability: [
      {
        day: { type: String, required: false },
        starTime: { type: String, required: false },
        endTime: { type: String, required: false },
      },
    ],
    reputation: {
      rating: { type: Number, default: 0 },
      rewiewsCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export const UserModel = mongoose.model<User>("users", UserSchema);



