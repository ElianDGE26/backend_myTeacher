import mongoose, { Schema } from "mongoose";
import { Pqr } from "../types/pqrTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.PQR;


const PqrSchema: Schema = new Schema<Pqr>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: MODEL_NAMES.USER, 
      required: true 
    },
    comments: { 
      type: String, 
      required: false 
    },
    status: { 
      type: String, 
      enum: ["open", "in_progress", "closed"], 
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
          userId: ret.userId,
          comments: ret.comments,
          status: ret.status
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



export const PqrModel = mongoose.model<Pqr>(COLLECTION_NAME, PqrSchema);



