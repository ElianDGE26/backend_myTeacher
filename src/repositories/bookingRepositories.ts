/**
 * @fileoverview Repositorio de Reservas y Tutorías (Booking Repository)
 * @module repositories/bookingRepositories
 * @description Capa de acceso a datos para la colección de reservas de clases en MongoDB, incluyendo consultas complejas, agregaciones analíticas y soporte transaccional.
 */

import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IBookingRepository, Booking } from "../types/bookingsTypes";
import mongoose, { Types } from "mongoose";
import { format } from "path";
import { preference } from "../config/mercadoPago";

/**
 * Repositorio que gestiona las operaciones de persistencia, pipelines de agregación y métricas de reservas.
 * Implementa `IBookingRepository`.
 *
 * @class BookingRepository
 * @implements {IBookingRepository}
 */
export class BookingRepository implements IBookingRepository {
  /**
   * Persiste una nueva reserva en la base de datos.
   *
   * @async
   * @param {Booking} data - Objeto con los datos de la reserva a registrar.
   * @returns {Promise<Booking>} Promesa que resuelve con la reserva guardada.
   */
  async create(data: Booking): Promise<Booking> {
    const newBooking = new BookingModel(data);
    return await newBooking.save();
  }

  /**
   * Consulta todas las reservas con poblado de nombres de estudiante y materia.
   *
   * @async
   * @param {Query} [query] - Criterios de filtrado para la búsqueda.
   * @returns {Promise<Booking[]>} Promesa que resuelve con un array de reservas encontradas.
   */
  async findAll(query?: Query): Promise<Booking[]> {
    return await BookingModel.find(query || {})
      .populate("studentId", "name")
      .populate("subjectId", "name")
      .exec();
  }

  /**
   * Busca una reserva específica por su ID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva.
   * @returns {Promise<Booking | null>} Promesa que resuelve con la reserva encontrada o null.
   */
  async findById(id: Types.ObjectId): Promise<Booking | null> {
    return await BookingModel.findById(id).exec();
  }

  /**
   * Actualiza una reserva por su ID, permitiendo opcionalmente participar en una transacción ACID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de la reserva.
   * @param {Partial<Booking>} data - Campos parciales a actualizar.
   * @param {mongoose.ClientSession | null} [session=null] - Sesión de transacción opcional.
   * @returns {Promise<Booking | null>} Promesa que resuelve con el documento actualizado o null.
   */
  async update( id: Types.ObjectId, data: Partial<Booking>, session: mongoose.ClientSession | null = null): Promise<Booking | null> {
    return await BookingModel.findByIdAndUpdate(id, data, { new: true, session }).exec();
  }

  /**
   * Elimina una reserva de la base de datos por su ID.
   *
   * @async
   * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva a eliminar.
   * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
   */
  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await BookingModel.findByIdAndDelete(id).exec();
    return result ? true : false;
  }

  /**
   * Busca una única reserva que coincida con los criterios dados.
   *
   * @async
   * @param {Query} query - Criterios de búsqueda en MongoDB.
   * @returns {Promise<Booking | null>} Promesa que resuelve con la reserva encontrada o null.
   */
  async findOne(query: Query): Promise<Booking | null> {
    return await BookingModel.findOne(query).exec();
  }

  /**
   * Cuenta la cantidad de documentos de reserva que satisfacen una condición.
   *
   * @async
   * @param {Query} query - Criterios de consulta (ej: tutorId, status, date).
   * @returns {Promise<number>} Promesa que resuelve con la cantidad de documentos.
   */
  async countByDocuments(query: Query): Promise<number> {
    return await BookingModel.countDocuments(query).exec();
  }

  /**
   * Actualiza múltiples documentos de reserva que cumplan con la condición especificada.
   *
   * @async
   * @param {Query} query - Filtro de selección para los documentos a actualizar.
   * @param {Partial<Booking>} update - Datos o campos a aplicar.
   * @returns {Promise<void>}
   */
  async updateMany(query: Query, update: Partial<Booking>): Promise<void> {
    await BookingModel.updateMany(query, update).exec();
  }

  /**
   * Cuenta la cantidad de estudiantes únicos (distintos) que tuvieron al menos una tutoría
   * en estado "Completada" en un rango de fechas determinado.
   *
   * @async
   * @param {Query} query - Parámetros de consulta (tutorId, rango de fechas).
   * @returns {Promise<number>} Promesa que resuelve con el número de estudiantes distintos.
   */
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

  /**
   * Agrupa y contabiliza las reservas completadas o aceptadas de un tutor para cada día del mes actual (en UTC).
   * Rellena todos los días calendario del mes (1..28/31) con 0 si no hubo citas ese día.
   *
   * @async
   * @param {Query} query - Objeto que contiene `{ tutorId: string | Types.ObjectId }`.
   * @returns {Promise<{ day: number; count: number }[]>} Promesa que resuelve con un array ordenado de días del mes y su conteo de citas.
   */
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

    //console.log("FINAL RESULT (UTC-aware) >> ", result);

    /* console.log(
      " DEBUG RESULT",
      await BookingModel.find({
        tutorId: id,
        status: "Completada",
        date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
      }).lean()
    ); */

  }

  /**
   * Obtiene las dos tutorías futuras más próximas para un tutor determinado según el estado solicitado.
   * Concatena fecha y hora en `startDateTime`, filtra `>= now`, ordena ascendentemente y puebla estudiante y materia.
   *
   * @async
   * @param {Types.ObjectId | string} tutorId - Identificador único del tutor.
   * @param {string} status - Estado de la reserva a filtrar (ej: "Aceptada").
   * @returns {Promise<any[]>} Promesa que resuelve con hasta 2 reservas próximas detalladas.
   */
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

    //console.log('bookings :>> ', bookings);
    return bookings;
  }

  /**
   * Realiza una agregación completa sobre las reservas poblando los datos del estudiante, tutor y materia,
   * e integrando un lookup adicional sobre la colección de reseñas para calcular el campo `reviewsCount`.
   *
   * @async
   * @param {Query} [query] - Criterios de filtrado opcionales para el pipeline.
   * @returns {Promise<(Booking & { reviewsCount: number })[]>} Promesa que resuelve con las reservas enriquecidas y el total de reseñas.
   */
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
      {
        $lookup: {
          from: "users", // nombre de la colección de estudiantes
          localField: "tutorId",
          foreignField: "_id",
          as: "tutor"
        }
      },
      { $unwind: { path: "$tutor", preserveNullAndEmptyArrays: true } },
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
          let: { bookingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookingId", "$$bookingId"]
                }
              }
            },
            {
              $count: "count"
            }
          ],
          as: "reviews"
        }
      },
      {
        $addFields: {
          reviewsCount: {
            $ifNull: [
              { $arrayElemAt: ["$reviews.count", 0] },
              0
            ]
          }
        }
      },
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
        preferenceId: 1,
        price: 1,
        discount: 1,
        totalAmount: {
           $add: ["$price", "$discount"]
        },
        tutor: {
          _id: 1,
          name: 1,
        },
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
