/**
 * @fileoverview Enrutador de Reservas y Tutorías (Booking Routes)
 * @module routes/bookingRoutes
 * @description Define las rutas HTTP para la creación, consulta, métricas, actualización y cancelación de reservas de clases particulares.
 * Base path: `/api/bookings`
 */

import { Router } from "express";
import { 
    createBooking, 
    getAllBookings, 
    getBookingByid, 
    updateBookingByid, 
    deleteBookingByid, 
    bookingsByStudentsId, 
    bookingsByTutorId, 
    getCountStudentsTheBookingForTutor, 
    getAllBookingsWithReviewCounts
} from "../controllers/bookingControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Obtiene todas las reservas de tutorías asociadas a un estudiante específico junto con el conteo de reseñas.
 *
 * @name GET /count/student-bookings/:userId
 * @route GET /api/bookings/count/student-bookings/:userId
 * @access Privado
 * @middleware verifyToken
 * @param {string} userId.path.required - ID de MongoDB (ObjectId) del estudiante.
 */
router.get("/count/student-bookings/:userId", verifyToken, bookingsByStudentsId);

/**
 * Obtiene todas las tutorías impartidas o programadas para un tutor específico junto con el conteo de reseñas.
 *
 * @name GET /count/tutor-bookings/:tutorId
 * @route GET /api/bookings/count/tutor-bookings/:tutorId
 * @access Privado
 * @middleware verifyToken
 * @param {string} tutorId.path.required - ID de MongoDB (ObjectId) del tutor.
 */
router.get("/count/tutor-bookings/:tutorId", verifyToken, bookingsByTutorId);

/**
 * Obtiene las estadísticas de estudiantes atendidos por día en el mes y las dos próximas citas confirmadas para un tutor.
 *
 * @name GET /countStudents-bookingsByTutor/:tutorId
 * @route GET /api/bookings/countStudents-bookingsByTutor/:tutorId
 * @access Público
 * @param {string} tutorId.path.required - ID de MongoDB (ObjectId) del tutor.
 */
router.get("/countStudents-bookingsByTutor/:tutorId", getCountStudentsTheBookingForTutor);

/**
 * Obtiene todas las reservas registradas agregando la cantidad de reseñas asociadas a cada una.
 *
 * @name GET /bokkingsWithReviewCount/
 * @route GET /api/bookings/bokkingsWithReviewCount/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/bokkingsWithReviewCount/", verifyToken, getAllBookingsWithReviewCounts);

/**
 * Obtiene el detalle completo de una reserva específica por su ID.
 *
 * @name GET /:id
 * @route GET /api/bookings/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reserva.
 */
router.get("/:id", verifyToken, getBookingByid);

/**
 * Obtiene todas las reservas registradas en el sistema.
 *
 * @name GET /
 * @route GET /api/bookings/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllBookings);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Crea una nueva reserva de tutoría con validación de disponibilidad y conflicto de horarios.
 *
 * @name POST /create
 * @route POST /api/bookings/create
 * @access Privado
 * @middleware verifyToken
 * @param {Booking} body.body.required - Datos de la reserva (studentId, tutorId, subjectId, date, startTime, endTime, price).
 */
router.post("/create", verifyToken, createBooking);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza los datos de una reserva existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/bookings/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reserva.
 * @param {Partial<Booking>} body.body.required - Campos a actualizar.
 */
router.put("/update/:id", verifyToken, updateBookingByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina una reserva de la base de datos por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/bookings/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la reserva a eliminar.
 */
router.delete("/delete/:id", verifyToken, deleteBookingByid);

export default router;


