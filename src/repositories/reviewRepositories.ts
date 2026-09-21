/**
 * @fileoverview Repositorio de Reseñas (Review Repository)
 * @module repositories/reviewRepositories
 * @description Capa de acceso a datos para la colección de calificaciones y opiniones en MongoDB usando Mongoose.
 */

import { ReviewModel } from "../models/reviewModels";
import { Query } from "../types/reporsitoryTypes";
import { IReviewRepository, Review } from "../types/reviewTypes";
import { Types } from "mongoose";

/**
 * Repositorio que gestiona las operaciones de persistencia y consultas de agregación para reseñas.
 * Implementa `IReviewRepository`.
 *
 * @class ReviewRepository
 * @implements {IReviewRepository}
 */
export class ReviewRepository implements IReviewRepository{
    
    /**
     * Cuenta el número de reseñas que cumplen con los criterios de búsqueda especificados.
     *
     * @async
     * @param {Query} query - Filtro de consulta (ej: `{ bookingId: ObjectId }`).
     * @returns {Promise<number>} Promesa que resuelve con la cantidad de reseñas encontradas.
     */
    async count(query: Query): Promise<number> {
       return await ReviewModel.countDocuments(query).exec();
    }

    /**
     * Persiste una nueva reseña en la base de datos.
     *
     * @async
     * @param {Review} data - Objeto con los datos de la reseña (bookingId, studentId, tutorId, rating, comment).
     * @returns {Promise<Review>} Promesa que resuelve con la reseña guardada.
     */
    async create(data: Review): Promise<Review> {
        const newReview = new ReviewModel(data);
        return await newReview.save();
    }

    /**
     * Consulta todas las reseñas según criterios de búsqueda opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado.
     * @returns {Promise<Review[]>} Promesa que resuelve con un array de reseñas.
     */
    async findAll(query?: Query): Promise<Review[]> {
        return await ReviewModel.find(query || {}).exec();
    }   

    /**
     * Busca una reseña por su identificador único (ObjectId).
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña.
     * @returns {Promise<Review | null>} Promesa que resuelve con la reseña encontrada o null si no existe.
     */
    async findById(id: Types.ObjectId): Promise<Review | null> {
        return await ReviewModel.findById(id).exec();
    }

    /**
     * Actualiza una reseña existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña.
     * @param {Partial<Review>} data - Campos parciales modificados.
     * @returns {Promise<Review | null>} Promesa que resuelve con la reseña actualizada o null.
     */
    async update(id: Types.ObjectId, data: Partial<Review>): Promise<Review | null> {
        return await ReviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina una reseña de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
     */
    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await ReviewModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca la primera reseña que coincida con los criterios dados.
     *
     * @async
     * @param {Query} query - Criterios de búsqueda en MongoDB.
     * @returns {Promise<Review | null>} Promesa que resuelve con la reseña coincidente o null.
     */
    async findOne (query: Query): Promise<Review | null> {
        return await ReviewModel.findOne(query).exec();
    }

    /**
     * Obtiene las reseñas vinculadas a un estudiante mediante agregación y lookup contra la colección `bookings`.
     *
     * @async
     * @param {Types.ObjectId} studentId - Identificador de MongoDB del estudiante.
     * @returns {Promise<Review[]>} Promesa que resuelve con el array de reseñas asociadas al estudiante.
     */
    async findReviewsByStudent(studentId: Types.ObjectId): Promise<Review[]> {
        return await ReviewModel.aggregate([
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "booking"
                }
            },
            {
                $unwind: "$booking"
            },
            {
                $match: {
                    "booking.studentId": studentId
                }
            },
            {
                $project: {
                    "booking": 0 // Exclude booking data from the final output, to match Review interface
                }
            }
        ]).exec();
    }

}