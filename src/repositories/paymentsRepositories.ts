/**
 * @fileoverview Repositorio de Pagos (Payments Repository)
 * @module repositories/paymentsRepositories
 * @description Capa de acceso a datos para la colección de pagos en MongoDB usando Mongoose, incluyendo agregaciones financieras para tutores.
 */

import { PaymentModel } from "../models/paymentsModels";
import { BookingModel } from "../models/bookingModels";
import { Query } from "../types/reporsitoryTypes";
import { IPaymentsRepository, Payments } from "../types/paymentsTypes";
import mongoose, { Types } from "mongoose";

/**
 * Repositorio que gestiona las transacciones y persistencia de pagos.
 * Implementa `IPaymentsRepository`.
 *
 * @class PaymentsRepository
 * @implements {IPaymentsRepository}
 */
export class PaymentsRepository implements IPaymentsRepository {

    /**
     * Persiste un nuevo pago en la base de datos con soporte opcional de transacción.
     *
     * @async
     * @param {Partial<Payments> | Payments} data - Datos del pago a registrar.
     * @param {mongoose.ClientSession | null} [session=null] - Sesión de transacción opcional.
     * @returns {Promise<Payments>} Promesa que resuelve con el pago creado.
     */
    async create(data: Partial<Payments> | Payments, session: mongoose.ClientSession | null = null): Promise<Payments> {
        const newPayment = new PaymentModel(data);
        return await newPayment.save({ session });
    }

    /**
     * Consulta todos los pagos registrados según criterios opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado de búsqueda.
     * @returns {Promise<Payments[]>} Promesa que resuelve con el array de pagos encontrados.
     */
    async findAll(query?: Query): Promise<Payments[]> {
        return await PaymentModel.find(query || {}).exec();
    }

    /**
     * Busca un pago específico por su identificador único de MongoDB.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador del pago.
     * @returns {Promise<Payments | null>} Promesa que resuelve con el pago encontrado o null.
     */
    async findById(id: Types.ObjectId): Promise<Payments | null> {
        return await PaymentModel.findById(id).exec();
    }

    /**
     * Actualiza un pago existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del pago.
     * @param {Partial<Payments>} data - Campos parciales actualizados del pago.
     * @returns {Promise<Payments | null>} Promesa que resuelve con el pago actualizado o null.
     */
    async update(id: Types.ObjectId, data: Partial<Payments>): Promise<Payments | null> {
        return await PaymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina un registro de pago de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador del pago a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminado exitosamente, o false en caso contrario.
     */
    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await PaymentModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca el primer pago que coincida con los criterios de consulta dados.
     *
     * @async
     * @param {Query} query - Criterios de búsqueda en MongoDB.
     * @returns {Promise<Payments | null>} Promesa que resuelve con el pago o null si no se encontró.
     */
    async findOne(query: Query): Promise<Payments | null> {
        return await PaymentModel.findOne(query).exec();
    }

    /**
     * Calcula la suma total de dinero recaudado en pagos confirmados ("Pagada")
     * correspondientes a las reservas de un tutor para un rango de fechas dado.
     *
     * @async
     * @param {Query} query - Parámetros de consulta conteniendo `{ tutorId, date }`.
     * @returns {Promise<number>} Promesa que resuelve con el monto monetario total recaudado.
     */
    async totalIncomeByTutor(query: Query): Promise<number> {
        const tutorId = query.tutorId;
        const datefilter = query.date;

        const resultBooking = await BookingModel.find({ tutorId: tutorId, date: datefilter }).select("_id").exec(); //Buscamos las tutorias  del tutorID
        const bookingIds = resultBooking.map(booking => booking._id); //Traemos solo el id

        //Buscamos en los pagos donde se encuentren los ids que ya tenemos de las reservas, en estados pagadas y sumamos los totales
        const result = await PaymentModel.aggregate([
            { $match: { bookingId: { $in: bookingIds }, status: "Pagada" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        return result[0]?.total || 0;
    }
}
