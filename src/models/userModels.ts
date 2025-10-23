import mongoose, { Schema, Document } from "mongoose";
import { User } from "../types/usersTypes";
import bcrypt from "bcryptjs";
import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.USER;


const UserSchema: Schema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    balance: { type: Number, required: false, default: 0 },
    validatedTeacher: { type: Boolean, default: false },
    phone: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    subjects: [
      { 
        type: Schema.Types.ObjectId, 
        ref: MODEL_NAMES.SUBJECT,
        required: false
      },
    ],
    availability: [
      {
        type: Schema.Types.ObjectId,
        ref: MODEL_NAMES.AVAILABILITIES,
        required: false
      }
    ],
    reputation: {
      rating: { type: Number, default: 0 },
      rewiewsCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
     toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          name: ret.name,
          balance: ret.balance,
          email: ret.email,
          role: ret.role,
          validatedTeacher: ret.validatedTeacher,
          phone: ret.phone,
          location: ret.location,
          subjects: ret.subjects,
          availability: ret.availability,
          reputation: ret.reputation,
        };
      } 
    } 
  }
);


UserSchema.pre<User>("save", async function (next){
  if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
  }
      next();
});

UserSchema.method("comparePassword", async function (passwordCompare: string): Promise<boolean> {
  return bcrypt.compare(passwordCompare, this.password as string);
});

export const UserModel = mongoose.model<User>(COLLECTION_NAME, UserSchema);



