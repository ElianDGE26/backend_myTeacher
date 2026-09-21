/**
 * @fileoverview Controlador de Disponibilidades (Availability Controller)
 * @module controllers/availabilityControllers
 * @description Administra las franjas horarias configuradas por los tutores y el cálculo dinámico de disponibilidad real restando reservas activas.
 */

import { IAvailabilityRepository, IAvailabilityService, Availability } from "../types/availabilityTypes";
import { AvailabilityRepository } from "../repositories/availabilityRepositories";
import { AvailabilityService } from "../services/availabilityService";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { BookingModel } from "../models/bookingModels";
import { IBookingRepository, IBookingService } from "../types/bookingsTypes";
import { IUserRepository } from "../types/usersTypes";
import { BookingRepository } from "../repositories/bookingRepositories";
import { UserRepository } from "../repositories/userRepositories";
import { BookingService } from "../services/bookingService";

const availabilityRepository: IAvailabilityRepository = new AvailabilityRepository();
const availabilityService: IAvailabilityService = new AvailabilityService(availabilityRepository);
//--
const bookingRepository: IBookingRepository = new BookingRepository();
const userRepository: IUserRepository = new UserRepository();
const bookingService: IBookingService = new BookingService(bookingRepository, userRepository);



/**
 * Obtiene todas las disponibilidades configuradas en el sistema.
 *
 * @route GET /api/availabilities
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todas las disponibilidades.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllAvailabilities = async (req: Request, res: Response) => {
    try {

        const result =  await availabilityService.findAllAvailabilities();

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Obtiene la información de una franja de disponibilidad específica por su ID.
 *
 * @route GET /api/availabilities/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la disponibilidad.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos de la disponibilidad.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o disponibilidad no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({ message: "Invalid Booking Id"})
                }
        
        const result =  await availabilityService.findAvailabilityById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "No Availability found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Crea una nueva franja de disponibilidad horaria para un tutor.
 *
 * @route POST /api/availabilities/create
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Availability} req.body - Datos de la disponibilidad (tutorId, dayOfWeek, startTime, endTime, active).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Disponibilidad creada exitosamente.
 * @returns {Promise<Response>} 400 - Error al crear la disponibilidad o datos inválidos.
 */
export const createAvailability = async (req: Request, res: Response) => {
    try {

        const newAvailability: Availability = req.body;

        const result =  await availabilityService.createAvailability(newAvailability);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}


/**
 * Actualiza una franja de disponibilidad existente por su ID.
 *
 * @route PUT /api/availabilities/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la disponibilidad.
 * @param {Availability} req.body - Datos modificados de la franja horaria.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con la disponibilidad actualizada.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o disponibilidad no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const updateAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const availabilityUpdate: Availability = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await availabilityService.updateAvailabilityById(new mongoose.Types.ObjectId(id), availabilityUpdate);

        if (!result) {
            return res.status(404).json({ message: "Availability not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Elimina una franja de disponibilidad de la base de datos por su ID.
 *
 * @route DELETE /api/availabilities/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) de la disponibilidad.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o disponibilidad no encontrada.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deleteAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Booking Id"})
        }

        const result =  await availabilityService.deleteAvailabilityById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "Availability not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Obtiene todas las franjas de disponibilidad asociadas a un tutor específico.
 *
 * @route GET /api/availabilities/availabilityTutor/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) del tutor.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con las disponibilidades del tutor.
 * @returns {Promise<Response>} 404 - ID inválido, no proporcionado o sin disponibilidades encontradas.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllAvailabilitiesByTutorId = async (req: Request, res: Response) => {
    try {
        const { id }= req.params;

        if(!id){
            return res.status(404).json({ message: "Missing Subject ID in params"});
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ message: "Invalid Booking Id" });
        }

        const result = await availabilityService.findAllAvailabilities({ tutorId: id});

        if (!result) {
             return res.status(404).json({ message: "No found availabilities by tutorId" });
        }

        res.json(result);

        
    } catch (error) {
        console.error("Error find availabilities by id tutor")
    }
}

/**
 * Calcula y devuelve los intervalos o franjas horarias reales disponibles de un tutor para una fecha específica.
 *
 * Proceso:
 * 1. Obtiene las disponibilidades activas del tutor para el día de la semana correspondiente a la fecha dada.
 * 2. Consulta las reservas existentes (Aceptadas, Pendientes por aceptar o Pendientes por pago aún no vencidas).
 * 3. Segmenta y resta los lapsos ocupados por reservas sobre las franjas configuradas, entregando solo los intervalos libres.
 *
 * @route GET /api/availabilities/tutors/:id/availability
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) del tutor.
 * @param {string} req.query.date - Fecha a consultar en formato 'YYYY-MM-DD'.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con la fecha, día de la semana en inglés y slots libres: `{ date, dayOfWeek, availableSlots: [{ startTime, endTime }] }`.
 * @returns {Promise<Response>} 400 - Parámetros faltantes, fecha inválida o tutorId mal formado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getTutorRealAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing Tutor ID" });
        }

        if (!date || typeof date !== "string") {
            return res.status(400).json({ message: "Missing or invalid date query parameter (YYYY-MM-DD)" });
        }

        //Válidamos Formato
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/; 
        const match = date.match(dateRegex); 
        if (!match) { 
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" }); 
        }

        const year = Number(match[1]); 
        const month = Number(match[2]); 
        const day = Number(match[3]);
        
        // Uso de mapeo de zona horaria local basado en componentes UTC para evitar problemas de desplazamiento de zona horaria
        const dateObj = new Date(year, month - 1, day);

        if ( dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day ) { 
            return res.status(400).json({ message: "Invalid date. Please provide a valid calendar date." }); 
        }
        
        const daysOfWeekEs = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dayOfWeek = daysOfWeekEs[dateObj.getDay()];

        // Obtenemos la disponibilidad activa de los tutores para este día de la semana. No tiene en cuenta las reservas
        const availabilities = await availabilityService.findAllAvailabilities({ 
            tutorId: id, 
            dayOfWeek: dayOfWeek,
            active: true 
        });

        // 2. Obtenemos las reservas activas para este tutor en esta fecha. Comparamos las representaciones de cadena o utilizamos 
        // startOfDay y endOfDay en UTC. Asumimos que las fechas se almacenan correctamente o en torno a la medianoche UTC.
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

        const activeStatuses = ["Pendiente por aceptar", "Aceptada"];

        // Filtramos las reservas que ya están hechas en esa fecha, para luego restarlas del horario disponible. 
        const bookings = await bookingService.findAllBookings({
            tutorId: id,
            date: { $gte: startOfDay, $lte: endOfDay },
            $or: [
                { status: { $in: activeStatuses } },
                { status: "Pendiente por pago", paymentExpiresAt: { $gt: new Date() } }
            ]
        });

        let availableSlots: {startTime: string, endTime: string}[] = [];

        // Filtramos solo los horarios disponibles del tutor para el dia en cuestión.
        availabilities.forEach(avail => {
            availableSlots.push({
                startTime: avail.startTime,
                endTime: avail.endTime
            });
        });

        // Restamos el tiempo de ocupación de las reservas hechas, del horario disponible 
        bookings.forEach(booking => {
            const bookingStart = timeToMinutes(booking.startTime);
            const bookingEnd = timeToMinutes(booking.endTime);

            let newAvailableSlots: {startTime: string, endTime: string}[] = [];

            availableSlots.forEach(slot => {
                const slotStart = timeToMinutes(slot.startTime);
                const slotEnd = timeToMinutes(slot.endTime);

                // Determinamos si la reserva NO se cruza con el horario disponible.
                //La reserva empieza cuando el slot ya terminó, o la reserva termina cuando el slot empieza. En ambos casos no hay cruce
                if (bookingStart >= slotEnd || bookingEnd <= slotStart) {
                    newAvailableSlots.push(slot);
                } else {
                    //Si el horario disponible empieza antes de que empiece la reserva, entonces hay un horario disponible antes de la reserva
                    if (slotStart < bookingStart) {
                        newAvailableSlots.push({
                            startTime: slot.startTime,
                            endTime: minutesToTime(bookingStart)
                        });
                    }
                    //Si el horario disponible termina después de que termina la reserva, entonces hay un horario disponible después de la reserva
                    if (slotEnd > bookingEnd) {
                        newAvailableSlots.push({
                            startTime: minutesToTime(bookingEnd),
                            endTime: slot.endTime
                        });
                    }
                }
            });
            availableSlots = newAvailableSlots;
        });

        // Sort slots by start time
        availableSlots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

        const daysOfWeekEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const dayOfWeekEn = daysOfWeekEn[dateObj.getDay()];

        res.json({
            date: date,
            dayOfWeek: dayOfWeekEn,
            availableSlots
        });

    } catch (error) {
        console.error("Error fetching real availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Convierte un formato de hora HH:mm a minutos acumulados del día.
 *
 * @param {string} time - Hora en formato militar HH:mm.
 * @returns {number} Cantidad de minutos desde las 00:00.
 * @throws {Error} Si el formato o los valores de hora/minuto son inválidos.
 */
const timeToMinutes = (time: string) => {
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const matchTime = time.match(timeRegex);

    if (!matchTime) {
        throw new Error(`Invalid time format: ${time}. Use HH:mm`);
    }

    const hours = Number(matchTime[1]);
    const minutes = Number(matchTime[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error(`Invalid time: ${time}`);
    }

    return hours * 60 + minutes;
};

/**
 * Convierte un valor de minutos acumulados del día a cadena formateada 'HH:mm'.
 *
 * @param {number} minutes - Minutos acumulados desde las 00:00.
 * @returns {string} Hora formateada en 2 dígitos para horas y minutos ('HH:mm').
 */
const minutesToTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};