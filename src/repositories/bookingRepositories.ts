import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";
import { Types } from "mongoose";
import { format } from "path";


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

    /* recuento de los estudiantes que han tenido al menos una tutoria en estado completada en el mes; 
    En el servicio se utilizó tambien para hacer la comparación del mes actual con el mes anterior*/
    async recuentStudentsBookings(query: Query): Promise<number> {
        const Idtutor = query.tutorId;
        const datefilter = query.date;

        const students = await BookingModel.distinct( 
            "studentId", { 
                tutorId: Idtutor, 
                status: "Completada", 
                date: datefilter
            } 
        ); 

        return students.length; 
    }


    /* función para tener el recuento de estudiante agrupados por cada dia del mes actual de los estudiantes que han tenido una reserva en estado completada  */
    async recuentStudentsForDays(query: Query): Promise<{ day: number; count: number; }[]> {
        const id  = new Types.ObjectId(query.tutorId as string); // Aseguramos ObjectId
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); //dia inicial del mes
        const endOfMonth = new Date(now.getFullYear(), now.getMonth()+ 1, 0, 23, 59, 59, 999);  // dia final del mes
        console.log('id :>> ', id);
        console.log('startOfMonth :>> ', startOfMonth);
        console.log('endOfMonthh :>> ', endOfMonth);

        const result = await BookingModel.aggregate([
        {
            $match: {
                tutorId: id,
                status: "Completada",
                date: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        {
            $group: {
                _id: { $dayOfMonth: "$date" },
                students: { $addToSet: "$studentId" }
            }
        },
        {
            $project: {
                day: "$_id",
                count: { $size: "$students" },
                _id: 0
            }
        },
        { $sort: { day: 1 } }
    ]);
        
        return result; // Devuelve algo como [{ day: 1, count: 3 }, { day: 2, count: 5 }, ...]
    }

    /** Funcion para traer los dos  */
    async nextBooking(tutorId: Types.ObjectId | string, status: string): Promise<any[]> {
        const now = new Date();

        const bookings = await BookingModel.aggregate([
            {
                $match: {
                    tutorId: new Types.ObjectId(tutorId),
                    status: status
                }
            },
            {
                $addFields: {
                    startDateTime: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $dateToString: { date: "$dateObj", format: "%Y-%m-%d" } },
                                    "T",
                                    "$startTime",
                                    ":00"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    startDateTime: { $gte: now }
                }
            },
            { $sort: { startDateTime: 1 } },
            { $limit: 2 },
            {
                $lookup: {
                    from: "users",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" }
        ]);

        return bookings;
    };

    

}