import mongoose, { Schema } from "mongoose";
import { Review } from "../types/reviewTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.REVIEWS;


const ReviewSchema: Schema = new Schema<Review>(
  {
    bookingId: { 
      type: Schema.Types.ObjectId, 
      ref: MODEL_NAMES.BOOKINGS, 
      required: true 
    },
    rating: { 
      type: Number, 
      min:[1, "La minima calificacion es 1"], 
      max:[5, "La maxima calificacion es 5"],
      required: true 
    },
    comments: { 
      type: String, 
      required: false 
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          bookingId: ret.bookingId,
          rating: ret.rating,
          comments: ret.comments
        };
      }
    }
  }
);

export const ReviewModel = mongoose.model<Review>(COLLECTION_NAME, ReviewSchema);



