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



export const getAllAvailabilities = async (req: Request, res: Response) => {
    try {

        const result =  await availabilityService.findAllAvailabilities();

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

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


// Calculamos la disponibilidad real
const timeToMinutes = (time: string) => {
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const match = time.match(timeRegex);

    if (!match) {
        throw new Error(`Invalid time format: ${time}. Use HH:mm`);
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error(`Invalid time: ${time}`);
    }

    return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};