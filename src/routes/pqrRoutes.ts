/**
 * @fileoverview Enrutador de PQR (Peticiones, Quejas y Reclamos Routes)
 * @module routes/pqrRoutes
 * @description Define las rutas HTTP para la gestión de solicitudes, peticiones, quejas y reclamos (PQR) de usuarios en la plataforma.
 * Base path: `/api/pqrs`
 */

import { Router } from "express";
import { 
    createPqr, 
    getAllPqrs, 
    getPqrByid, 
    updatePqrByid, 
    deletePqrByid 
} from "../controllers/pqrControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Obtiene la lista completa de todos los casos de PQR registrados en la plataforma.
 *
 * @name GET /
 * @route GET /api/pqrs/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllPqrs);

/**
 * Obtiene la información detallada de una PQR específica por su ID.
 *
 * @name GET /:id
 * @route GET /api/pqrs/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del caso PQR.
 */
router.get("/:id", verifyToken, getPqrByid);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Registra una nueva PQR en el sistema asociada a un usuario solicitante.
 *
 * @name POST /create
 * @route POST /api/pqrs/create
 * @access Privado
 * @middleware verifyToken
 * @param {Pqr} body.body.required - Datos de la PQR (userId, type, subject, description, status).
 */
router.post("/create", verifyToken, createPqr);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza el estado, respuesta o detalles de una PQR existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/pqrs/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del caso PQR.
 * @param {Partial<Pqr>} body.body.required - Campos a modificar (por ejemplo status, response).
 */
router.put("/update/:id", verifyToken, updatePqrByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina un registro de PQR del sistema por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/pqrs/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del caso PQR a eliminar.
 */
router.delete("/delete/:id", verifyToken, deletePqrByid);

export default router;


