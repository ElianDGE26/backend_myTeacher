import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";
import { Types } from "mongoose";


export class BookingRepository implements IBookingRepository{


    async countByDocuments(query: Query): Promise<number> {
        return await BookingModel.countDocuments(query).exec();
    }

    async recuentStudentsBookings(tutorId: Types.ObjectId): Promise<number> {
        const students = await BookingModel.distinct("studentId", { tutorId, status: "completed"}); 
        return students.length; 
    }

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