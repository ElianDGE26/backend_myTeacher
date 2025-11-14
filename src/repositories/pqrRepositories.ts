import { PqrModel } from "../models/pqrModels";
import { Query } from "../types/reporsitoryTypes";
import { IPqrRepository, Pqr } from "../types/pqrTypes";
import { Types } from "mongoose";


export class PqrRepository implements IPqrRepository{


    async create(data: Pqr): Promise<Pqr> {
        const newPqr = new PqrModel(data);
        return await newPqr.save();
    }

    async findAll(query?: Query): Promise<Pqr[]> {
        return await PqrModel.find(query || {}).exec();
    }   

    async findById(id: Types.ObjectId): Promise<Pqr | null> {
        return await PqrModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, data: Partial<Pqr>): Promise<Pqr | null> {
        return await PqrModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await PqrModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Pqr | null> {
        return await PqrModel.findOne(query).exec();
    }


}