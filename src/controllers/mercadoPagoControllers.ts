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

export const createPreference = async (req: Request, res: Response) => {
    try {

        const { bookingId } = req.body;

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
                success: `${config.frontendUrlProd}/payment/success`,
                failure: `${config.frontendUrlProd}/payment/failure`,
                pending: `${config.frontendUrlProd}/payment/pending`,
            },
            auto_return: "approved",
            notification_url: "https://sequel-defective-alabaster.ngrok-free.dev/api/mercadopago/webhook"// URL expuesta a internet para probar webhooks

        };
        const response = await preference.create({ body });

        console.log({
            preferenceId: response.id,
            initPoint: response.init_point,
            notificationUrl: body.notification_url,
            externalReference: body.external_reference
        });

        // Retornamos el id de la preferencia para que el frontend abra el checkout
        res.status(200).json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error("Error creating preference:", error);
        res.status(500).json({ message: "Error creating preference" });
    }
};

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
        const existingBooking = await bookingRepository.findById(objectIdBooking);
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
        await bookingRepository.update(objectIdBooking, { status: "Pendiente por aceptar" }, session);

        let paymentMethod: "Tarjeta" | "Transferencia bancaria" | "Paypal";

        if (mpPayment.payment_type_id === "credit_card") {          paymentMethod = "Tarjeta"; }
        else if (mpPayment.payment_type_id === "debit_card") {      paymentMethod = "Tarjeta"; }
        else if (mpPayment.payment_type_id === "bank_transfer") {   paymentMethod = "Transferencia bancaria"; }
        else if (mpPayment.payment_type_id === "paypal") {          paymentMethod = "Paypal"; }
        else {                                                      paymentMethod = "Tarjeta"; }

        // Creamos el registro del pago pasando la sesión
        await paymentRepository.create({
            bookingId: objectIdBooking,
            method: paymentMethod,
            status: "Pagada",
            date: new Date(mpPayment.date_approved || Date.now()),
            currency: mpPayment.currency_id || "COP",
            amount: mpPayment.transaction_amount || 0,
        }, session);

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