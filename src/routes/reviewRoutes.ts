/**
 * @fileoverview Enrutador de Reseñas (Review Routes)
 * @module routes/reviewRoutes
 * @description Define las rutas HTTP para la gestión de calificaciones y comentarios de estudiantes sobre clases y reservas realizadas.
 * Base path: `/api/reviews`
 */

import { Router } from "express";
import { 
    createReview, 
    getAllReviews, 
    getReviewByid, 
    updateReviewByid, 
    deleteReviewByid, 
    getReviewsByBooking, 
    getReviewsByStudent 
} from "../controllers/reviewControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Obtiene todas las reseñas registradas en la plataforma.
 *
 * @name GET /
 * @route GET /api/reviews/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllReviews);

/**
 * Obtiene los detalles de una reseña específica por su ID.
 *
 * @name GET /:id
 * @route GET /api/reviews/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reseña.
 */
router.get("/:id", verifyToken, getReviewByid);

/**
 * Obtiene la lista de reseñas asociadas a una reserva específica.
 *
 * @name GET /booking/:bookingId
 * @route GET /api/reviews/booking/:bookingId
 * @access Privado
 * @middleware verifyToken
 * @param {string} bookingId.path.required - ID de MongoDB (ObjectId) de la reserva.
 */
router.get("/booking/:bookingId", verifyToken, getReviewsByBooking);

/**
 * Obtiene todas las reseñas emitidas por un estudiante específico.
 *
 * @name GET /student/:studentId
 * @route GET /api/reviews/student/:studentId
 * @access Privado
 * @middleware verifyToken
 * @param {string} studentId.path.required - ID de MongoDB (ObjectId) del estudiante.
 */
router.get("/student/:studentId", verifyToken, getReviewsByStudent);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Registra una nueva reseña y calificación asociada a una reserva completada.
 *
 * @name POST /create
 * @route POST /api/reviews/create
 * @access Privado
 * @middleware verifyToken
 * @param {Review} body.body.required - Datos de la reseña (bookingId, studentId, tutorId, rating, comment).
 */
router.post("/create", verifyToken, createReview);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza la calificación o comentario de una reseña existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/reviews/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reseña.
 * @param {Partial<Review>} body.body.required - Campos a modificar (rating, comment).
 */
router.put("/update/:id", verifyToken, updateReviewByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina una reseña del sistema por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/reviews/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reseña a eliminar.
 */
router.delete("/delete/:id", verifyToken, deleteReviewByid);

export default router;


