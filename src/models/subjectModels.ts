import mongoose, { Schema, Document } from "mongoose";
import { Subject } from "../types/subjectsTypes";

import { MODEL_NAMES } from "../config/config";

const COLLECTION_NAME: string = MODEL_NAMES.SUBJECT;


const SubjectSchema: Schema = new Schema<Subject>(
  {
    name: { type: String, required: true },
    educationLevel: { type: String, required: true },
    Description: { type: String, required: false },
    price: { type: Number, required: true }
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
          Description: ret.Description,
          price: ret.price
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



export const SubjectModel = mongoose.model<Subject>(COLLECTION_NAME, SubjectSchema);



