import mongoose, { Schema } from "mongoose";
import { Payments } from "../types/paymentsTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.PAYMENTS;


const PaymentSchema: Schema = new Schema<Payments>(
  {
    bookingId: { 
      type: Schema.Types.ObjectId, 
      ref: MODEL_NAMES.BOOKINGS, 
      required: true 
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true
    },
    method: {
      type: String,
      enum: ["card", "bank_transfer", "paypal"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:{ 
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          bookingId: ret.bookingId,
          tutorId: ret.tutorId,
          studentId: ret.studentId,
          method: ret.method,
          status: ret.status,
          date: ret.date,
          currency: ret.currency,
          amount: ret.amount
        }
      }
    }
  }
);


export const PaymentModel = mongoose.model<Payments>(COLLECTION_NAME, PaymentSchema);

/* PaymentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
}); */

/* SubjectSchema.methods.toJSON = function() {
  const object = this.toObject();
  delete object.password;
  return object;
} */






