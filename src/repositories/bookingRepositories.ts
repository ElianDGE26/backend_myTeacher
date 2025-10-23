import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";


export class BookingRepository implements IBookingRepository{


    async create(data: Booking): Promise<Booking> {
        const newBooking = new BookingModel(data);
        return await newBooking.save();
    }

    async findAll(query?: Query): Promise<Booking[]> {
        return await BookingModel.find(query || {}).exec();
    }   

    async findById(id: string): Promise<Booking | null> {
        return await BookingModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Booking>): Promise<Booking | null> {
        return await BookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: string): Promise<boolean> {
        const result = await BookingModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Booking | null> {
        return await BookingModel.findOne(query).exec();
    }


}