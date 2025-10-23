import mongoose, { Schema } from "mongoose";
import { Availability } from "../types/availabilityTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.AVAILABILITIES;


const AvailabilitySchema: Schema = new Schema<Availability>(
  {
    tutorId: { 
      type: Schema.Types.ObjectId, 
      ref: MODEL_NAMES.USER, 
      required: true 
    },
    date: { 
      type: Date, 
      required: false 
    },
    dayOfWeek: { 
      type: String, 
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 
      required: false 
    },
    startTime: { 
      type: String, 
      required: true
    },
    endTime: { 
      type: String, 
      required: true
    },
    isRecurring: {
      type: Boolean,
      required: true
    },
    active: { 
      type: Boolean, 
      default: true 
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          tutorId: ret.tutorId,
          date: ret.date,
          dayOfWeek: ret.dayOfWeek,
          startTime: ret.startTime,
          endTime: ret.endTime,
          isRecurring: ret.isRecurring,
          active: ret.active
        };
      }
    }
  }
);


/* SubjectSchema.methods.toJSON = function() {
  const object = this.toObject();
  delete object.password;
  return object;
} */



export const AvailabilityModel = mongoose.model<Availability>(COLLECTION_NAME, AvailabilitySchema);



