import { AvailabilityModel } from "../models/availabilityModels";
import { Query } from "../types/reporsitoryTypes";
import { IAvailabilityRepository, Availability } from "../types/availabilityTypes";


export class AvailabilityRepository implements IAvailabilityRepository{


    async create(data: Availability): Promise<Availability> {
        const newAvailability = new AvailabilityModel(data);
        return await newAvailability.save();
    }

    async findAll(query?: Query): Promise<Availability[]> {
        return await AvailabilityModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<Availability | null> {
        return await AvailabilityModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Availability>): Promise<Availability | null> {
        return await AvailabilityModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await AvailabilityModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Availability | null> {
        return await AvailabilityModel.findOne(query).exec();
    }


}