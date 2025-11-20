import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";
import { Types } from "mongoose";


export class BookingRepository implements IBookingRepository{

    async create(data: Booking): Promise<Booking> {
        const newBooking = new BookingModel(data);
        return await newBooking.save();
    }

    async findAll(query?: Query): Promise<Booking[]> {
        return await BookingModel.find(query || {}).exec();
    }   

    async findById(id: Types.ObjectId): Promise<Booking | null> {
        return await BookingModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, data: Partial<Booking>): Promise<Booking | null> {
        return await BookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await BookingModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    async findOne (query: Query): Promise<Booking | null> {
        return await BookingModel.findOne(query).exec();
    }


    async countByDocuments(query: Query): Promise<number> {
        return await BookingModel.countDocuments(query).exec();
    }

    /* recuento de los estudiantes que han tenido al menos una tutoria en el mes y se hce una comparación con el mes anterior */
    async recuentStudentsBookings(query: Query): Promise<number> {
        const Idtutor = query.tutorId;
        const datefilter = query.date;
        const students = await BookingModel.distinct( "studentId", { tutorId: Idtutor, status: "Completada", date: datefilter} ); 
        return students.length; 
    }


    async recuentStudentsForDays(query: Query): Promise<{ day: number; count: number; }[]> {
        const id  = query.idTutor;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); //dia inicial del mes
        const endOfMonthh = new Date(now.getFullYear(), now.getMonth()+ 1, 0, 23, 59, 59, 999);  // 
        

        const result = await BookingModel.aggregate([
            {
                $match: {
                    tutorId: id,
                    status: "Completada",
                    date: { $gte: startOfMonth, $lte: endOfMonthh} // filtrar por mes actual
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$date"},  // agrupar por día del mes
                    students: { $addToSet: "$studentId"} // tomar solo estudiantes únicos
                }
            },
            {
                $project: {
                    day: "$_id",
                    count: { $size: "$students"},
                    _id: 0
                }
            },
            {
                $sort: {
                    dat:1
                }
            }
        ]);
        
        return result; // Devuelve algo como [{ day: 1, count: 3 }, { day: 2, count: 5 }, ...]
    }



}