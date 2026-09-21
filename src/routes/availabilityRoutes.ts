/**
 * @fileoverview Enrutador de Disponibilidades (Availability Routes)
 * @module routes/availabilityRoutes
 * @description Define las rutas HTTP para la consulta, creación, actualización y eliminación de disponibilidades de tutores, así como el cálculo de disponibilidad real.
 * Base path: `/api/availabilities`
 */

import { Router } from "express";
import { 
    createAvailability, 
    getAllAvailabilities, 
    getAllAvailabilitiesByTutorId, 
    getAvailabilityByid, 
    updateAvailabilityByid, 
    deleteAvailabilityByid, 
    getTutorRealAvailability
} from "../controllers/availabilityControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Calcula y devuelve los intervalos o franjas horarias reales disponibles de un tutor para una fecha dada.
 * Resta las reservas activas (aceptadas, pendientes de aceptación o pago vigente) de sus disponibilidades semanales configuradas.
 *
 * @name GET /tutors/:id/availability
 * @route GET /api/availabilities/tutors/:id/availability
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del tutor.
 * @param {string} date.query.required - Fecha de consulta en formato 'YYYY-MM-DD'.
 */
router.get("/tutors/:id/availability", verifyToken, getTutorRealAvailability);

/**
 * Obtiene el listado completo de disponibilidades horarias configuradas para un tutor específico.
 *
 * @name GET /availabilityTutor/:id
 * @route GET /api/availabilities/availabilityTutor/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del tutor.
 */
router.get("/availabilityTutor/:id", verifyToken, getAllAvailabilitiesByTutorId);

/**
 * Obtiene la información detallada de una franja de disponibilidad específica por su ID.
 *
 * @name GET /:id
 * @route GET /api/availabilities/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la disponibilidad.
 */
router.get("/:id", verifyToken, getAvailabilityByid);

/**
 * Obtiene todas las disponibilidades horarias registradas en la plataforma.
 *
 * @name GET /
 * @route GET /api/availabilities/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllAvailabilities);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Registra una nueva franja de disponibilidad horaria para un tutor.
 *
 * @name POST /create
 * @route POST /api/availabilities/create
 * @access Privado
 * @middleware verifyToken
 * @param {Availability} body.body.required - Datos de disponibilidad (tutorId, dayOfWeek, startTime, endTime, active).
 */
router.post("/create", verifyToken, createAvailability);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza una franja de disponibilidad existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/availabilities/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la disponibilidad.
 * @param {Partial<Availability>} body.body.required - Campos a actualizar.
 */
router.put("/update/:id", verifyToken, updateAvailabilityByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina una franja de disponibilidad de la base de datos por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/availabilities/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) de la disponibilidad a eliminar.
 */
router.delete("/delete/:id", verifyToken, deleteAvailabilityByid);

export default router;


