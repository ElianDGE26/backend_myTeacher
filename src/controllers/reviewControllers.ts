/**
 * @fileoverview Controlador de Reseñas / Calificaciones (Review Controller)
 * @module controllers/reviewControllers
 * @description Maneja las operaciones CRUD y consultas específicas de calificaciones y comentarios sobre tutorías y estudiantes.
 */

import {
  IReviewRepository,
  IReviewService,
  Review,
} from "../types/reviewTypes";
import { ReviewRepository } from "../repositories/reviewRepositories";
import { ReviewService } from "../services/reviewService";
import { Request, Response } from "express";
import mongoose from "mongoose";

const reviewRepository: IReviewRepository = new ReviewRepository();
const reviewService: IReviewService = new ReviewService(reviewRepository);

/**
 * Obtiene todas las reseñas registradas en el sistema.
 *
 * @route GET /api/reviews
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todas las reseñas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.findAllReviews();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene el detalle de una reseña específica por su ID.
 *
 * @route GET /api/reviews/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reseña.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con la información de la reseña.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reseña no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getReviewByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Review ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await reviewService.findReviewById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "No Review found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Crea una nueva reseña o calificación para una tutoría impartida.
 *
 * @route POST /api/reviews/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Review} req.body - Datos de la reseña (bookingId, studentId, tutorId, rating, comment, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Reseña creada exitosamente.
 * @returns {Promise<Response>} 400 - Error en los datos proporcionados o al guardar.
 */
export const createReview = async (req: Request, res: Response) => {
  try {
    const newReview: Review = req.body;

    const result = await reviewService.createReview(newReview);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

/**
 * Actualiza los datos o comentarios de una reseña existente por su ID.
 *
 * @route PUT /api/reviews/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reseña.
 * @param {Review} req.body - Campos actualizados de la reseña.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Reseña actualizada.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reseña no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const updateReviewByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviewUpdate: Review = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Review ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await reviewService.updateReviewById(
      new mongoose.Types.ObjectId(id),
      reviewUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Elimina una reseña específica de la base de datos por su ID.
 *
 * @route DELETE /api/reviews/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reseña.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reseña no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deleteReviewByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Review ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await reviewService.deleteReviewById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene todas las reseñas asociadas a una reserva/tutoría en particular.
 *
 * @route GET /api/reviews/booking/:bookingId
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.bookingId - Identificador único (ObjectId) de la reserva.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Lista de reseñas vinculadas a la reserva.
 * @returns {Promise<Response>} 400 - Parámetro bookingId ausente.
 * @returns {Promise<Response>} 404 - Formato de bookingId inválido.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getReviewsByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing Booking ID in params" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await reviewService.findReviewsByBooking(
      new mongoose.Types.ObjectId(bookingId)
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching Reviews by Booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene todas las reseñas redactadas o recibidas por un estudiante específico.
 *
 * @route GET /api/reviews/student/:studentId
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.studentId - Identificador único (ObjectId) del estudiante.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con las reseñas del estudiante.
 * @returns {Promise<Response>} 400 - Parámetro studentId ausente.
 * @returns {Promise<Response>} 404 - Formato de studentId inválido.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getReviewsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Missing Student ID in params" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(404).json({ message: "Invalid Student Id" });
    }

    const result = await reviewService.findReviewsByStudent(
      new mongoose.Types.ObjectId(studentId)
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching Reviews by Student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

