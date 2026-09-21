/**
 * @fileoverview Controlador de Pagos (Payments Controller)
 * @module controllers/paymentsControllers
 * @description Maneja las peticiones HTTP relacionadas con la gestión de pagos y estadísticas financieras de tutores.
 */

import {   IPaymentsRepository,   IPaymentsService,   Payments, } from "../types/paymentsTypes";
import { IBookingRepository,  IBookingService, Booking, } from "../types/bookingsTypes";
import { BookingService } from "../services/bookingService";
import { IUserRepository } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import { PaymentsRepository } from "../repositories/paymentsRepositories";
import { BookingRepository } from "../repositories/bookingRepositories";
import { PaymentsService } from "../services/paymentsService";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

const paymentRepository: IPaymentsRepository = new PaymentsRepository();
const bookingRepository: IBookingRepository = new BookingRepository();
const paymentService: IPaymentsService = new PaymentsService( paymentRepository, bookingRepository );
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);

/**
 * Obtiene el listado completo de todos los pagos registrados en el sistema.
 *
 * @route GET /api/payments
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todos los registros de pagos.
 * @returns {Promise<Response>} 500 - Error interno del servidor al consultar los pagos.
 */
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await paymentService.findAllPayments();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene la información detallada de un pago específico a partir de su ID.
 *
 * @route GET /api/payments/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único de MongoDB (ObjectId) del pago.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos del pago encontrado.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o pago no encontrado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getPaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.findPaymentById(new mongoose.Types.ObjectId(id));

    if (!result) {
      return res.status(404).json({ message: "No Payment found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Crea y registra un nuevo pago en el sistema.
 *
 * @route POST /api/payments/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Payments} req.body - Datos del pago a registrar (bookingId, providerPaymentId, method, status, amount, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Objeto con los datos del pago creado exitosamente.
 * @returns {Promise<Response>} 400 - Error en los datos proporcionados o fallo al procesar la creación.
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const newPayment: Payments = req.body;

    const result = await paymentService.createPayment(newPayment);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

/**
 * Actualiza la información de un pago existente por su ID.
 *
 * @route PUT /api/payments/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único de MongoDB (ObjectId) del pago.
 * @param {Payments} req.body - Campos actualizados del pago.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos actualizados del pago.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o pago no encontrado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const updatePaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PaymentUpdate: Payments = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.updatePaymentById(
      new mongoose.Types.ObjectId(id),
      PaymentUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Elimina un registro de pago específico por su ID.
 *
 * @route DELETE /api/payments/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único de MongoDB (ObjectId) del pago a eliminar.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto indicando el éxito de la eliminación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o pago no encontrado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deletePaymentByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Payment ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await paymentService.deletePaymentById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Obtiene las estadísticas consolidadas del docente/tutor:
 * métricas financieras, cantidad de estudiantes atendidos y próximas dos reservas programadas.
 *
 * @route GET /api/payments/stats/:tutorId
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.tutorId - Identificador único de MongoDB (ObjectId) del tutor.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con estadísticas financieras, estudiantes y próximas tutorías.
 * @returns {Promise<Response>} 400 - Parámetro tutorId ausente.
 * @returns {Promise<Response>} 404 - Formato de tutorId inválido.
 * @returns {Promise<Response>} 500 - Error inesperado al procesar las estadísticas.
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    if (!tutorId) {
      return res.status(400).json({ message: "Missing tutor ID in params" });
    }

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(404).json({ message: "Invalid Tutor Id" });
    }

    const id = new mongoose.Types.ObjectId(tutorId);

    // Ejecutar todas las promesas SIN romper ejecución usando allSettled
    const results = await Promise.allSettled([
      paymentService.totalTutorsStats(id),
      bookingService.getStudentsByTutorBooking(id),
      bookingService.getNextTwoBookingsForTutor(id, "Aceptada")
    ]);

    const [statsResult, studentsResult, nextBookingsResult] = results;

    const response = {
      message: "Teacher statistics retrieved",
      stats: statsResult.status === "fulfilled" ? statsResult.value : null,
      //statsError: statsResult.status === "rejected" ? statsResult.reason.message : null,

      students: studentsResult.status === "fulfilled" ? studentsResult.value : null,
      //studentsError: studentsResult.status === "rejected" ? studentsResult.reason.message : null,

      nextBookings:
        nextBookingsResult.status === "fulfilled" ? nextBookingsResult.value : null,
      //nextBookingsError: nextBookingsResult.status === "rejected" ? nextBookingsResult.reason.message : null
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error retrieving statistics",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

