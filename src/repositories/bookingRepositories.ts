import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";
import { Types } from "mongoose";
import { format } from "path";


export class BookingRepository implements IBookingRepository {
  async create(data: Booking): Promise<Booking> {
    const newBooking = new BookingModel(data);
    return await newBooking.save();
  }

  async findAll(query?: Query): Promise<Booking[]> {
    return await BookingModel.find(query || {})
      .populate("studentId", "name")
      .populate("subjectId", "name")
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<Booking | null> {
    return await BookingModel.findById(id).exec();
  }

  async update( id: Types.ObjectId, data: Partial<Booking>): Promise<Booking | null> {
    return await BookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await BookingModel.findByIdAndDelete(id).exec();
    return result ? true : false;
  }

  async findOne(query: Query): Promise<Booking | null> {
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

    const students = await BookingModel.distinct("studentId", {
      tutorId: Idtutor,
      status: "Completada",
      date: datefilter,
    });

    return students.length;
  }



  /* función para tener el recuento de estudiante agrupados por cada dia del mes actual de los estudiantes que han tenido una reserva en estado completada  */
  async recuentStudentsForDays( query: Query ): Promise<{ day: number; count: number }[]> {
    const id = new Types.ObjectId(query.tutorId as string);

    const now = new Date();
    const yearUTC = now.getUTCFullYear();
    const monthUTC = now.getUTCMonth(); // 0..11

    const startOfMonthUTC = new Date( Date.UTC(yearUTC, monthUTC, 1, 0, 0, 0, 0) );
    // primer milisegundo del mes siguiente en UTC, menos 1 ms para obtener el final del mes actual
    const firstOfNextMonthUTC = new Date(Date.UTC(yearUTC, monthUTC + 1, 1, 0, 0, 0, 0) );
    const endOfMonthUTC = new Date(firstOfNextMonthUTC.getTime() - 1);

    //console.log("startOfMonthUTC :>> ", startOfMonthUTC.toISOString());
    //console.log("endOfMonthUTC   :>> ", endOfMonthUTC.toISOString());

    const result = await BookingModel.aggregate([
      {
        $match: {
          tutorId: id,
          // filtrar por rango
          date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
          // comparar status de forma case-insensitive (evita problemas si hay "completada", "Completada", etc.)
          $expr: {
            $in: [
              { $toLower: "$status" },
              ["completada", "aceptada"]
            ]
          },
        },
      },
      {
        // sacar el día del mes basado en la fecha (Mongo guarda Date en UTC)
        $project: {
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          day: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { day: 1 } },
    ]);

      const totalDias = endOfMonthUTC.getUTCDate(); // último día del mes (28–31)

      const filled = Array.from({ length: totalDias }, (_, i) => {
        const day = i + 1;
        const found = result.find(r => r.day === day);

        return {
          day,
          count: found ? found.count : 0
        };
      });

      return filled;  // Devuelve algo como [{ day: 1, count: 3 }, { day: 2, count: 5 }, ...]

    //console.log("📌 FINAL RESULT (UTC-aware) >> ", result);

    /* console.log(
      " DEBUG RESULT",
      await BookingModel.find({
        tutorId: id,
        status: "Completada",
        date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
      }).lean()
    ); */

  }

  /** Funcion para traer las dos tutorias proximas*/
  async nextBooking( tutorId: Types.ObjectId | string, status: string ): Promise<any[]> {
    const now = new Date();

    const bookings = await BookingModel.aggregate([
      {
        $match: {
          tutorId: new Types.ObjectId(tutorId),
          $expr: { $eq: [{ $toLower: "$status" }, status.toLowerCase()] },
        },
      },
      {
        // fecha + hora combinadas en un solo Date real
        $addFields: {
          startDateTime: {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { date: "$date", format: "%Y-%m-%d" } },
                  "T",
                  "$startTime",
                  ":00",
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          startDateTime: { $gte: now },
        },
      },
      { $sort: { startDateTime: 1 } },
      { $limit: 2 },
        // Populate student
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

    // Populate subject
    {
        $lookup: {
        from: 'subjects',         
        localField: 'subjectId',
        foreignField: '_id',
        as: 'subject'
        }
    },
    { $unwind: '$subject' },
    //datos a mostrar
    {
        $project: {
        _id: 1,
        type: 1,
        location: 1,
        status: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
        price: 1,
        startDateTime: 1,
        videoCallLink:1,
        student: {
            _id: 1,
            name: 1,
        },
        subject: {
            _id: 1,
            name: 1,
        }
        }
    }
    ]);

    console.log('bookings :>> ', bookings);
    return bookings;
  }


  async findAllWithReviewCount(query?: Query): Promise<(Booking & { reviewsCount: number })[]> {
    return BookingModel.aggregate([
      { $match: query || {} },

      // Lookup para traer info del estudiante
      {
        $lookup: {
          from: "users", // nombre de la colección de estudiantes
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },

      // Lookup para traer info de la materia
      {
        $lookup: {
          from: "subjects", // nombre de la colección de materias
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: { path: "$subject", preserveNullAndEmptyArrays: true } },

      // Lookup para contar reviews
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "bookingId",
          as: "reviews"
        }
      },
      {
        $addFields: {
          reviewsCount: { $size: "$reviews" }
        }
      },

      // Limpiar arrays innecesarios
      {
        $project: {
        _id: 1,
        tutorId:1,
        type: 1,
        location: 1,
        status: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
        videoCallLink:1,
        price: 1,
        student: {
            _id: 1,
            name: 1,
        },
        subject: {
            _id: 1,
            name: 1,
        },
        reviewsCount: 1
        }
      }
    ]);
  }
}