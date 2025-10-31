import mongoose, { Schema, Document } from "mongoose";
import { Subject } from "../types/subjectsTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.SUBJECT;


const SubjectSchema: Schema = new Schema<Subject>(
  {
    name: { type: String, required: true },
    educationLevel: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER,required: true}
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret: any) => {
        return {
          _id: ret._id,
          name: ret.name,
          educationLevel: ret.educationLevel,
          description: ret.description,
          price: ret.price,
          tutorId: ret.tutorId
        };
      }
    }
  }
);





export const SubjectModel = mongoose.model<Subject>(COLLECTION_NAME, SubjectSchema);



