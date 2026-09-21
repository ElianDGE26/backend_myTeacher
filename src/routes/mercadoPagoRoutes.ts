/**
 * @fileoverview Enrutador de Mercado Pago (Mercado Pago Routes)
 * @module routes/mercadoPagoRoutes
 * @description Define las rutas HTTP para la integración con Mercado Pago, incluyendo la creación de preferencias de pago y la recepción de notificaciones webhook.
 * Base path: `/api/mercadopago`
 */

import { Router } from "express";
import { verifyToken } from "../middelwears/authMiddelwears";
import { createPreference, receiveWebhook } from "../controllers/mercadoPagoControllers";

const router = Router();

// ==========================================
// Rutas POST
// ==========================================

/**
 * Crea una preferencia de pago en Mercado Pago para una tutoría/reserva.
 * Genera el ID de preferencia y la URL init_point hacia la cual redirigir al estudiante para realizar el pago.
 *
 * @name POST /create_preference
 * @route POST /api/mercadopago/create_preference
 * @access Público
 * @param {string} body.title - Título del servicio o clase a pagar.
 * @param {number} body.unit_price - Valor monetario unitario de la clase.
 * @param {number} [body.quantity=1] - Cantidad de horas o clases.
 * @param {string} [body.tutorId] - ID del tutor asociado.
 * @param {string} [body.bookingId] - ID de la reserva asociada.
 */
router.post("/create_preference", createPreference);

/**
 * Recibe y procesa las notificaciones webhooks/IPN enviadas por los servidores de Mercado Pago.
 * Verifica el estado del pago y actualiza la reserva y el registro de pago correspondientes en la base de datos.
 *
 * @name POST /webhook
 * @route POST /api/mercadopago/webhook
 * @access Público
 * @param {object} query.query - Parámetros de consulta enviados por Mercado Pago (incluyendo type, data.id).
 * @param {object} body.body - Cuerpo de la notificación de evento de Mercado Pago.
 */
router.post("/webhook", receiveWebhook);

export default router;