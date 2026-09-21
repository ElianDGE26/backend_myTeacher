/**
 * @fileoverview Servicio de Reseñas y Calificaciones (Review Service)
 * @module services/reviewService
 * @description Capa de lógica de negocio para la gestión de valoraciones, retroalimentación y comentarios entre estudiantes y tutores.
 */

import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { IReviewRepository, IReviewService, Review } from "../types/reviewTypes";

/**
 * Servicio encargado de gestionar las operaciones y consultas de reseñas.
 * Implementa la interfaz `IReviewService`.
 *
 * @class ReviewService
 * @implements {IReviewService}
 */
export class ReviewService implements IReviewService {
    private reviewRepository: IReviewRepository;

    /**
     * Inicializa una nueva instancia de ReviewService inyectando su repositorio.
     *
     * @constructor
     * @param {IReviewRepository} reviewRepository - Repositorio para operaciones de persistencia de reseñas.
     */
    constructor(reviewRepository: IReviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    /**
     * Cuenta la cantidad de reseñas asociadas a una reserva específica.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva.
     * @returns {Promise<number>} Promesa que resuelve con el número de reseñas encontradas.
     */
    async countReviewsByBooking(id: Types.ObjectId): Promise<number> {
        return await this.reviewRepository.count({ bookingId: id});
    } 

    /**
     * Registra una nueva reseña o calificación en el sistema.
     *
     * @async
     * @param {Review} review - Objeto con los datos de la reseña (bookingId, studentId, tutorId, rating, comment).
     * @returns {Promise<Review>} Promesa que resuelve con la reseña creada.
     */
    async createReview (review: Review): Promise<Review> {
        return await this.reviewRepository.create(review);
    }

    /**
     * Consulta todas las reseñas registradas según criterios de filtrado opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda y filtros.
     * @returns {Promise<Review[]>} Promesa que resuelve con un array de reseñas.
     */
    async findAllReviews (query?: Query): Promise<Review[]> {
        return await this.reviewRepository.findAll(query);
    }

    /**
     * Busca una reseña específica por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña.
     * @returns {Promise<Review | null>} Promesa que resuelve con la reseña encontrada o null si no existe.
     */
    async findReviewById (id: Types.ObjectId): Promise<Review | null> {
        return await this.reviewRepository.findById(id);
    }

    /**
     * Actualiza los datos de una reseña existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña.
     * @param {Partial<Review>} review - Campos modificados de la reseña.
     * @returns {Promise<Review | null>} Promesa que resuelve con la reseña actualizada o null.
     */
    async updateReviewById (id: Types.ObjectId, review: Partial<Review>): Promise<Review | null> {
        return await this.reviewRepository.update(id, review);
    }   

    /**
     * Elimina una reseña de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reseña a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
     */
    async deleteReviewById (id: Types.ObjectId): Promise<boolean> {
        return await this.reviewRepository.delete(id);
    }  

    /**
     * Obtiene todas las reseñas asociadas a una reserva en particular.
     *
     * @async
     * @param {Types.ObjectId} bookingId - Identificador de MongoDB de la reserva.
     * @returns {Promise<Review[]>} Promesa que resuelve con el listado de reseñas de esa tutoría.
     */
    async findReviewsByBooking(bookingId: Types.ObjectId): Promise<Review[]> {
        return await this.reviewRepository.findAll({ bookingId });
    }

    /**
     * Obtiene todas las reseñas vinculadas a un estudiante específico.
     *
     * @async
     * @param {Types.ObjectId} studentId - Identificador de MongoDB del estudiante.
     * @returns {Promise<Review[]>} Promesa que resuelve con el array de reseñas del estudiante.
     */
    async findReviewsByStudent(studentId: Types.ObjectId): Promise<Review[]> {
        return await this.reviewRepository.findReviewsByStudent(studentId);
    }
}