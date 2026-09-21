/**
 * @fileoverview Enrutador de Pagos (Payments Routes)
 * @module routes/paymentsRoutes
 * @description Define las rutas HTTP para la gestión de pagos, obtención de estadísticas financieras de tutores y operaciones CRUD de transacciones.
 * Base path: `/api/payments`
 */

import { Router } from "express";
import { 
    createPayment, 
    getAllPayments, 
    getPaymentByid, 
    updatePaymentByid, 
    deletePaymentByid, 
    getStats
} from "../controllers/paymentsControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Obtiene métricas y estadísticas financieras consolidadas para un tutor específico.
 * Incluye ingresos totales, ingresos mensuales, ingresos pendientes y conteo de pagos completados.
 *
 * @name GET /stats/:tutorId
 * @route GET /api/payments/stats/:tutorId
 * @access Público
 * @param {string} tutorId.path.required - ID de MongoDB (ObjectId) del tutor.
 */
router.get("/stats/:tutorId", getStats);

/**
 * Obtiene la lista completa de todos los registros de pago almacenados en la plataforma.
 *
 * @name GET /
 * @route GET /api/payments/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllPayments);

/**
 * Obtiene la información detallada de un pago específico por su ID.
 *
 * @name GET /:id
 * @route GET /api/payments/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del pago.
 */
router.get("/:id", verifyToken, getPaymentByid);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Crea y registra un nuevo pago en el sistema.
 *
 * @name POST /create
 * @route POST /api/payments/create
 * @access Privado
 * @middleware verifyToken
 * @param {Payment} body.body.required - Datos del pago (bookingId, studentId, tutorId, amount, paymentMethod, status, transactionId).
 */
router.post("/create", verifyToken, createPayment);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza la información o estado de un pago existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/payments/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del pago.
 * @param {Partial<Payment>} body.body.required - Campos del pago a modificar.
 */
router.put("/update/:id", verifyToken, updatePaymentByid);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina un registro de pago de la base de datos por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/payments/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del pago a eliminar.
 */
router.delete("/delete/:id", verifyToken, deletePaymentByid);

export default router;


