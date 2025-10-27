import mongoose, { Schema } from "mongoose";
import { Booking } from "../types/bookingsTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.BOOKINGS;


const BookingSchema: Schema = new Schema<Booking>(
  {
    studentId: { 
      type: Schema.Types.ObjectId, 
      ref: MODEL_NAMES.USER, 
      required: true 
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.SUBJECT,
      required: true
    },
    type: {
      type: String,
      enum: ["virtual", "in-person"],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "canceled"],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    videoCallLink: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
     toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          studentId: ret.studentId,
          tutorId: ret.tutorId,
          subjectId: ret.subjectId,
          type: ret.type,
          location: ret.t,
          status: ret.status,
          date: ret.date,
          startTime: ret.startTime,
          endTime: ret.endTime,
          videoCallLink: ret.videoCallLink,
          price: ret.price
        };
      }
    } 
  }
);


export const BookingModel = mongoose.model<Booking>(COLLECTION_NAME, BookingSchema);



