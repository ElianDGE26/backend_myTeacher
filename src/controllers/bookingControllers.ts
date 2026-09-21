/**
 * @fileoverview Controlador de Reservas / Tutorías (Booking Controller)
 * @module controllers/bookingControllers
 * @description Maneja el ciclo de vida de las reservas de clases, validaciones de horarios, conflictos de disponibilidad y conteos para métricas.
 */

import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { BookingService } from "../services/bookingService";
import { Request, Response } from "express";
import { IUserRepository } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import mongoose, { Types } from "mongoose";
import CustomError from "../utils/CustomError";
import { IAvailabilityRepository, IAvailabilityService } from "../types/availabilityTypes";
import { AvailabilityRepository } from "../repositories/availabilityRepositories";
import { AvailabilityService } from "../services/availabilityService";

const bookingRepository: IBookingRepository = new BookingRepository();
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);

const availabilityRepository: IAvailabilityRepository = new AvailabilityRepository();
const availabilityService: IAvailabilityService = new AvailabilityService(availabilityRepository);

/**
 * Obtiene todas las reservas registradas junto con el conteo de reseñas asociadas.
 *
 * @route GET /api/bookings/bokkingsWithReviewCount/
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Lista de reservas con la cantidad de reseñas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllBookingsWithReviewCounts = async (req: Request, res: Response) => {
    try {
        const result =  await bookingService.findAllWithReviewCount();
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Obtiene todas las reservas registradas en la base de datos.
 *
 * @route GET /api/bookings
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todas las reservas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result =  await bookingService.findAllBookings();
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Obtiene el detalle de una reserva específica por su ID.
 *
 * @route GET /api/bookings/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reserva.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos de la reserva.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reserva no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getBookingByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        //se envia el parametro como tipo Object Id
        const result =  await bookingService.findBookingById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "No Booking found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Crea una nueva reserva realizando validaciones estrictas de:
 * 1. Formato de fecha y correspondencia con el día de la semana.
 * 2. Horario dentro de las disponibilidades activas del tutor.
 * 3. Detección de solapamientos o conflictos con reservas existentes (Pendiente por aceptar, Aceptada o Pendiente por pago vigente).
 * 4. Asignación automática de ventana de expiración de 15 minutos para pagos pendientes.
 *
 * @route POST /api/bookings/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Booking} req.body - Datos de la reserva (studentId, tutorId, subjectId, date, startTime, endTime, price, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Reserva creada exitosamente.
 * @returns {Promise<Response>} 400 - Formato de fecha erróneo o horario fuera de la disponibilidad del tutor.
 * @returns {Promise<Response>} 409 - Conflicto de horario (el tutor ya tiene una reserva en ese rango).
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const createBooking = async (req: Request, res: Response) => {
    try {
        const newBooking: Booking = req.body;

        // Verificamos formato  de la fecha
        let bookingDateStr = String(newBooking.date);
        let dateObj: Date;
        
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})(T.*)?$/; 
        const match = bookingDateStr.match(dateRegex); 

        let dayOfWeek:string = "";
        let startOfDay: Date;
        let endOfDay: Date;
        const daysOfWeekEs = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        if (match) {

            const year = Number(match[1]); 
            const month = Number(match[2]); 
            const day = Number(match[3]);

            dateObj = new Date(year, month - 1, day);
            dayOfWeek = daysOfWeekEs[dateObj.getDay()]!;

            startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
            endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
        } else {
            dateObj = new Date(bookingDateStr);

            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ message: "Invalid date format." });
            }
            // 
            dayOfWeek = daysOfWeekEs[dateObj.getUTCDay()]!;
            startOfDay = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 0, 0, 0));
            endOfDay = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 23, 59, 59));
        }

        // Disponibilidad del tutor
        const availabilities = await availabilityService.findAllAvailabilities({ 
            tutorId: newBooking.tutorId, 
            dayOfWeek: dayOfWeek,
            active: true 
        });

        if (!availabilities || availabilities.length === 0) {
            return res.status(400).json({ message: "El tutor no tiene disponibilidad para este día." });
        }
        
        const bookingStart = timeToMinutes(newBooking.startTime);
        const bookingEnd = timeToMinutes(newBooking.endTime);

        // Validar dentro de ventana de disponibilidad activa
        let isWithinAvailability = false;
        for (const avail of availabilities) {
            const availStart = timeToMinutes(avail.startTime);
            const availEnd = timeToMinutes(avail.endTime);
            if (bookingStart >= availStart && bookingEnd <= availEnd) {
                isWithinAvailability = true;
                break;
            }
        }

        if (!isWithinAvailability) {
            return res.status(400).json({ message: "El horario solicitado no está dentro de la disponibilidad del tutor." });
        }

        // Conflicto con bookings existentes
        const activeStatuses = ["Pendiente por aceptar", "Aceptada"];
        const existingBookings = await bookingService.findAllBookings({
            tutorId: newBooking.tutorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            $or: [
                { status: { $in: activeStatuses } },
                { status: "Pendiente por pago", paymentExpiresAt: { $gt: new Date() } }
            ]
        });

        for (const existing of existingBookings) {
            const existingStart = timeToMinutes(existing.startTime);
            const existingEnd = timeToMinutes(existing.endTime);
            
            // Si hay un cruce: (el inicio de la nueva es ANTES del fin de la existente Y el fin de la nueva es DESPUÉS del inicio de la existente)
            if (bookingStart < existingEnd && bookingEnd > existingStart) {
                return res.status(409).json({ message: "Este horario acaba de ser reservado. Actualiza los horarios disponibles." });
            }
        }

        // Si pasa todas las validaciones, creamos la reserva
        // Asignamos fecha de expiración si está en estado pendiente de pago
        if (!newBooking.status || newBooking.status === "Pendiente por pago") {
            const expireDate = new Date();
            expireDate.setMinutes(expireDate.getMinutes() + 15);
            newBooking.paymentExpiresAt = expireDate;
        }

        const result =  await bookingService.createBooking(newBooking);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error creating Booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Convierte una hora en formato militar HH:mm a minutos totales desde el inicio del día.
 *
 * @param {string} time - Hora en formato "HH:mm".
 * @returns {number} Minutos transcurridos desde las 00:00.
 * @throws {Error} Si el formato no coincide con HH:mm.
 */
const timeToMinutes = (time: string) => {
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const matchTime = time.match(timeRegex);
    if (!matchTime) {
        throw new Error(`Invalid time format: ${time}. Use HH:mm`);
    }
    return Number(matchTime[1]) * 60 + Number(matchTime[2]);
};

/**
 * Actualiza los datos de una reserva por su ID.
 *
 * @route PUT /api/bookings/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reserva.
 * @param {Booking} req.body - Propiedades actualizadas de la reserva.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Reserva actualizada.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reserva no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const updateBookingByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const bookingUpdate: Booking = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }
        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await bookingService.updateBookingById(new mongoose.Types.ObjectId(id), bookingUpdate);

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Elimina una reserva de la base de datos por su ID.
 *
 * @route DELETE /api/bookings/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la reserva a eliminar.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o reserva no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deleteBookingByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Booking ID in params" });
        }
        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await bookingService.deleteBookingById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Obtiene todas las reservas de tutorías asociadas a un estudiante específico.
 *
 * @route GET /api/bookings/count/student-bookings/:userId
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.userId - Identificador único (ObjectId) del estudiante.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con las reservas del estudiante y conteo de reseñas.
 * @returns {Promise<Response>} 400 - Parámetro userId ausente.
 * @returns {Promise<Response>} 404 - Formato de userId inválido o sin reservas asociadas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const bookingsByStudentsId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('userId :>> ', userId);
        
        if (!userId){
            return res.status(400).json( { message: "Missing user ID in params" } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const resutlt = await bookingService.findAllWithReviewCount({ studentId: new mongoose.Types.ObjectId(userId)});

        if( !resutlt || resutlt.length === 0 ){
            return  res.status(404).json( { message: "No bookings found for the given student ID"} );
        }

        res.json(resutlt);
    } catch (error) {
        console.log('error find bookings by students id:>> ', error);
        res.status(500).json( { message: "Internat server Error"} );
    }
}

/**
 * Obtiene todas las tutorías impartidas o agendadas para un tutor específico.
 *
 * @route GET /api/bookings/count/tutor-bookings/:tutorId
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.tutorId - Identificador único (ObjectId) del tutor.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con las reservas del tutor y conteo de reseñas.
 * @returns {Promise<Response>} 400 - Parámetro tutorId ausente.
 * @returns {Promise<Response>} 404 - Formato de tutorId inválido o sin reservas asociadas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const bookingsByTutorId = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        console.log('userId :>> ', tutorId);
        
        if (!tutorId){
            return res.status(400).json( { message: "Missing user ID in params" } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const resutlt = await bookingService.findAllWithReviewCount({ tutorId: new mongoose.Types.ObjectId(tutorId)});

        if( !resutlt || resutlt.length === 0 ){
            return  res.status(404).json( { message: "No bookings found for the given tutor ID"} );
        }

        res.json(resutlt);
    } catch (error) {
        console.log('error find bookings by tutor id:>> ', error);
        res.status(500).json( { message: "Internat server Error"} );
    }
}

/**
 * Obtiene el número de estudiantes que han reservado clases con el tutor (para gráficas estadísticas)
 * y las próximas dos reservas confirmadas (con estado "Aceptada").
 *
 * @route GET /api/bookings/countStudents-bookingsByTutor/:tutorId
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.tutorId - Identificador único (ObjectId) del tutor.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con estadísticas de estudiantes (`result`) y próximas reservas (`nextBookings`).
 * @returns {Promise<Response>} 400 - Parámetro tutorId ausente.
 * @returns {Promise<Response>} 404 - Formato de tutorId inválido.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getCountStudentsTheBookingForTutor = async (req:Request, res:Response) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json( {
                message: "The tutor ID must be required"
            } );
        }

        //se valida que el id si sea de tipo Object ID
        if (!mongoose.Types.ObjectId.isValid(tutorId))  {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result = await bookingService.getStudentsByTutorBooking(new mongoose.Types.ObjectId(tutorId));

        let nextBookings = null;

        try {
            nextBookings = await bookingService.getNextTwoBookingsForTutor(
                new mongoose.Types.ObjectId(tutorId),
                "Aceptada"
            );
        } catch (error) {
            console.log("Error getting next bookings, ignoring error:", error);
            nextBookings = null; // o []
        }

        return res.json({
            result,
            nextBookings
        });
        
    }catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.log("Error counting students who made reservations with tutor : >>>> ", error);
        res.status(500).json({ message: "Error counting students who made reservations with tutor "} );
    }
}
 