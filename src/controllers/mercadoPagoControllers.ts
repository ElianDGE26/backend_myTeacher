/**
 * @fileoverview Controlador de Mercado Pago (Mercado Pago Controller)
 * @module controllers/mercadoPagoControllers
 * @description Maneja la integración con la pasarela de pagos Mercado Pago: creación de preferencias de pago (checkout) y procesamiento de notificaciones webhook mediante transacciones ACID de MongoDB.
 */

import { Request, Response } from "express";
import { preference, client } from "../config/mercadoPago";
import { PaymentsRepository } from "../repositories/paymentsRepositories";
import { BookingRepository } from "../repositories/bookingRepositories";
import { PaymentsService } from "../services/paymentsService";
import { UserRepository } from "../repositories/userRepositories";
import { IBookingRepository, IBookingService } from "../types/bookingsTypes";
import { IUserRepository, IUserService, User } from "../types/usersTypes";
import { IPaymentsRepository, IPaymentsService } from "../types/paymentsTypes";
import { BookingService } from "../services/bookingService";
import mongoose from "mongoose";
import { UserService } from "../services/userService";
import { Payment } from "mercadopago";
import config from "../config/config";

const paymentRepository: IPaymentsRepository = new PaymentsRepository();
const bookingRepository: IBookingRepository = new BookingRepository();
const paymentService: IPaymentsService = new PaymentsService(paymentRepository, bookingRepository);
const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);                  
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);

/**
 * Crea una preferencia de pago en Mercado Pago para una reserva pendiente de pago.
 *
 * Flujo:
 * 1. Valida el `bookingId` y comprueba que la reserva esté en estado "Pendiente por pago".
 * 2. Verifica la existencia del estudiante asociado y valida la URL de retorno permitida.
 * 3. Configura los ítems, pagador, URLs de redirección y webhook en la preferencia de Mercado Pago.
 * 4. Actualiza la reserva con el `preferenceId` generado y devuelve los datos al frontend para abrir el checkout.
 *
 * @route POST /api/mercadopago/create_preference
 * @access Público / Cliente
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.bookingId - ID de MongoDB de la reserva.
 * @param {string} req.body.returnUrl - URL base del frontend para redirección posterior al pago.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con `{ id: string, init_point: string }` de la preferencia.
 * @returns {Promise<Response>} 400 - Booking ID inválido, reserva no apta para pago o returnUrl no permitida.
 * @returns {Promise<Response>} 404 - Reserva o usuario no encontrado.
 * @returns {Promise<Response>} 500 - Error al comunicarse con Mercado Pago o procesar la preferencia.
 */
export const createPreference = async (req: Request, res: Response) => {
    try {

        const { bookingId, returnUrl } = req.body;

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid Booking ID" });
        }
        //Buscamos el booking
        const booking = await bookingService.findBookingById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.status !== "Pendiente por pago") return res.status(400).json({ message: "Reserva no válida para pago" });

        //Usuario a la que pertenece la reserva
        const user: User | null = await userService.findUserById(booking.studentId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const allowedReturnUrls = [
            config.frontendUrlProd,
            config.urlFrontendNgrok,
        ];

        if (!allowedReturnUrls.includes(returnUrl)) {
            return res.status(400).json({
                error: "Invalid return URL",
            });
        }

        const body = {
            items: [
                {
                    id: `Reserva de clase ${bookingId}`,
                    title: `Tutoría: ${booking.type}`,
                    quantity: 1,
                    unit_price: Number(booking.price),
                    currency_id: "COP",
                },
            ],
            payer: {
                email: user.email,
            },
            external_reference: bookingId.toString(),
            back_urls: {
                success: `${returnUrl}/payment/result`,
                failure: `${returnUrl}/payment/result`,
                pending: `${returnUrl}/payment/result`,
            },
            auto_return: "approved",
            notification_url: `${config.urlBackendProd}/api/mercadopago/webhook`//

        };
        const response = await preference.create({ body });

        console.log({
            preferenceId: response.id,
            initPoint: response.init_point,
            notificationUrl: body.notification_url,
            externalReference: body.external_reference
        });

        await bookingService.updateBookingById(bookingId,{preferenceId: response.id});

        // Retornamos el id de la preferencia para que el frontend abra el checkout
        res.status(200).json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error("Error creating preference:", error);
        res.status(500).json({ message: "Error creating preference" });
    }
};

/**
 * Recibe y procesa las notificaciones de eventos (Webhooks) enviadas por Mercado Pago.
 *
 * Flujo transaccional (ACID):
 * 1. Extrae el `paymentId` y valida que el tópico sea de tipo 'payment'.
 * 2. Inicia una sesión con transacción en MongoDB.
 * 3. Consulta el estado del pago directamente en la API de Mercado Pago.
 * 4. Valida que el estado sea 'approved', evitando duplicados si la reserva ya fue aceptada.
 * 5. Actualiza atómicamente el estado de la reserva a "Pendiente por aceptar" y registra el nuevo pago.
 * 6. Hace commit de la transacción o rollback (abort) en caso de fallo, asegurando el cierre de la sesión.
 *
 * @route POST /api/mercadopago/webhook
 * @access Público (Llamado por los servidores de Mercado Pago)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} [req.query['data.id']] - ID del pago enviado en la notificación.
 * @param {string} [req.query.id] - ID alternativo del pago.
 * @param {string} [req.query.type] - Tipo de evento (ej: 'payment').
 * @param {string} [req.query.topic] - Tópico alternativo de la notificación.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Notificación procesada con éxito, ignorada o duplicada.
 * @returns {Promise<Response>} 400 - Parámetros de referencia inválidos.
 * @returns {Promise<Response>} 404 - Reserva no encontrada.
 * @returns {Promise<Response>} 500 - Error al procesar el webhook.
 */
export const receiveWebhook = async (req: Request, res: Response) => {

    console.log("WEBHOOK RECIBIDO");

    // Mercado Pago envía el ID en req.query.data.id o req.query.id dependiendo del tipo de evento
    const paymentId = req.query["data.id"] || req.query.id;
    const type = req.query.type || req.query.topic;

    // Si no es un evento de pago,
    if (type !== "payment" || !paymentId) {
        return res.status(200).send("Notificación ignorada");
    }
    
    // Iniciamos la sesión transaccional de Mongoose
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Consultamos el estado real del pago a la API de MP
        const paymentClient = new Payment(client);
        const mpPayment = await paymentClient.get({ id: String(paymentId) });

        console.log({
            id: mpPayment.id,
            status: mpPayment.status,
            status_detail: mpPayment.status_detail,
            external_reference: mpPayment.external_reference,
            transaction_amount: mpPayment.transaction_amount
        });

        // Si el pago no está aprobado, abortamos y cerramos
        if (mpPayment.status !== "approved") {
            await session.abortTransaction();
            return res.status(200).send("Pago no aprobado");
        }

        const bookingId = mpPayment.external_reference;
        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            await session.abortTransaction();
            return res.status(400).send("Sin referencia válida");
        }

        const objectIdBooking = new mongoose.Types.ObjectId(bookingId);

        // Revisamos si ya procesamos este pago
        const existingBooking = await bookingService.findBookingById(objectIdBooking);
        if (!existingBooking) {
            await session.abortTransaction();
            return res.status(404).send("Reserva no encontrada");
        }

        // Si la reserva ya fue aceptada, este es un webhook duplicado de Mercado Pago
        if (existingBooking.status === "Pendiente por aceptar") {
            await session.abortTransaction();
            return res.status(200).send("Pago ya procesado anteriormente");
        }

        // 3. ATOMICIDAD (Transacciones): Ejecutamos las dos escrituras juntas
        // A. Actualizamos la reserva pasando la sesión
        await bookingService.updateBookingById(objectIdBooking, { status: "Pendiente por aceptar" }, session);

        let paymentMethod: "Tarjeta" | "Transferencia bancaria" | "Paypal";

        if (mpPayment.payment_type_id === "credit_card") {          paymentMethod = "Tarjeta"; }
        else if (mpPayment.payment_type_id === "debit_card") {      paymentMethod = "Tarjeta"; }
        else if (mpPayment.payment_type_id === "bank_transfer") {   paymentMethod = "Transferencia bancaria"; }
        else if (mpPayment.payment_type_id === "paypal") {          paymentMethod = "Paypal"; }
        else {                                                      paymentMethod = "Tarjeta"; }

        const amountTotal = (mpPayment.transaction_amount ?? 0) + (existingBooking.discount || 0);
        // Creamos el registro del pago pasando la sesión
        await paymentService.createPayment({
            bookingId: objectIdBooking,
            providerPaymentId: String(mpPayment.id),
            method: paymentMethod,
            status: "Pagada",
            date: new Date(mpPayment.date_approved || Date.now()),
            currency: mpPayment.currency_id || "COP",
            amount: amountTotal || 0,
        } as any, session);

        // Si ambas operaciones fueron exitosas, hacemos el commit a la base de datos
        await session.commitTransaction();
        res.status(200).send("Transacción completada exitosamente");

    } catch (error) {
        // Si algo falla (red, validación, BD), deshacemos TODOS los cambios en bloque
        await session.abortTransaction();
        console.error("Error en el webhook:", error);
        res.status(500).json({ message: "Error processing webhook" });
    } finally {
        // Siempre cerramos la sesión para no agotar el pool de conexiones
        session.endSession();
    }
};