import mongoose, { Schema, Document } from "mongoose";
import { Session } from "../types/sessionTypes";
import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.SESSIONS;
const COLLECTION_USER: string = MODEL_NAMES.USER;

const SessionSchema: Schema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_USER,
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          userId: ret.userId,
          accessToken: ret.accessToken,
          refreshToken: ret.refreshToken,
          expiresAt: ret.expiresAt
        };
      },
    },
  }
);

export const SessionModel = mongoose.model<Session>(COLLECTION_NAME, SessionSchema);
