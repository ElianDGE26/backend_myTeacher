/**
 * @fileoverview Servicio de Reservas y Tutorías (Booking Service)
 * @module services/bookingService
 * @description Capa de lógica de negocio para la administración de reservas de clases, métricas de estudiantes por tutor, próximas citas y expiración programada de pagos.
 */

import mongoose, { Types } from "mongoose";
import { IBookingRepository, IBookingService, Booking } from "../types/bookingsTypes";
import { Query } from "../types/reporsitoryTypes";
import { IUserRepository } from "../types/usersTypes";

/**
 * Servicio encargado de gestionar la lógica de negocio de las reservas de clases y tutorías.
 * Implementa la interfaz `IBookingService`.
 *
 * @class BookingService
 * @implements {IBookingService}
 */
export class BookingService implements IBookingService {
    private bookingRepository: IBookingRepository;
    private userRepository: IUserRepository;

    /**
     * Inicializa una nueva instancia de BookingService inyectando los repositorios necesarios.
     *
     * @constructor
     * @param {IBookingRepository} bookingRepository - Repositorio para persistencia de reservas.
     * @param {IUserRepository} userRepository - Repositorio para validación y consulta de usuarios.
     */
    constructor(bookingRepository: IBookingRepository, userRepository: IUserRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Obtiene una lista de reservas agregando el conteo de reseñas vinculadas a cada una.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado opcionales (ej: studentId, tutorId, status).
     * @returns {Promise<(Booking & { reviewsCount: number; })[]>} Promesa que resuelve con las reservas y su número de reseñas.
     */
    async findAllWithReviewCount(query?: Query): Promise<(Booking & { reviewsCount: number; })[]> {
       const result = await this.bookingRepository.findAllWithReviewCount(query);
        return result;
    }

    /**
     * Cuenta la cantidad de reservas de un tutor que coinciden con un estado y fecha específicos.
     *
     * @async
     * @param {Types.ObjectId} tutorId - Identificador del tutor.
     * @param {string} status - Estado de la reserva (ej: "Aceptada", "Cancelada", "Pendiente").
     * @param {Date} date - Fecha específica para el conteo.
     * @returns {Promise<number>} Promesa que resuelve con el número de reservas encontradas.
     */
    async countBookingsBystatus(tutorId: Types.ObjectId, status: string, date: Date): Promise<number> {
        return await this.bookingRepository.countByDocuments({ tutorId, status, date});
    }

    /**
     * Cuenta el total de estudiantes distintos que han reservado tutorías con base en un filtro.
     *
     * @async
     * @param {Query} query - Criterios de consulta (ej: tutorId, rango de fechas).
     * @returns {Promise<number>} Promesa que resuelve con la cantidad de estudiantes únicos encontrados.
     */
    async recuentStudentsBookings(query: Query): Promise<number> {
        return await this.bookingRepository.recuentStudentsBookings( query );
    }

    /**
     * Registra una nueva reserva en el sistema.
     *
     * @async
     * @param {Booking} booking - Objeto con los datos de la reserva a crear.
     * @returns {Promise<Booking>} Promesa que resuelve con la reserva guardada.
     */
    async createBooking (booking: Booking): Promise<Booking> {
        return await this.bookingRepository.create(booking);
    }

    /**
     * Consulta todas las reservas aplicando filtros opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios opcionales de búsqueda.
     * @returns {Promise<Booking[]>} Promesa que resuelve con un array de reservas.
     */
    async findAllBookings (query?: Query): Promise<Booking[]> {
        const result = await this.bookingRepository.findAll(query);
        return result;
    }

    /**
     * Busca una reserva específica por su identificador único.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva.
     * @returns {Promise<Booking | null>} Promesa que resuelve con la reserva o null si no existe.
     */
    async findBookingById (id: Types.ObjectId): Promise<Booking | null> {
        return await this.bookingRepository.findById(id);
    }

    /**
     * Actualiza una reserva por su ID, con soporte opcional para transacciones de MongoDB.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva.
     * @param {Partial<Booking>} booking - Datos modificados de la reserva.
     * @param {mongoose.ClientSession | null} [session] - Sesión de transacción opcional para operaciones atómicas.
     * @returns {Promise<Booking | null>} Promesa que resuelve con la reserva actualizada o null.
     */
    async updateBookingById (id: Types.ObjectId, booking: Partial<Booking>, session?: mongoose.ClientSession | null): Promise<Booking | null> {
        return await this.bookingRepository.update(id, booking, session);
    }   

    /**
     * Elimina una reserva de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la reserva a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
     */
    async deleteBookingById (id: Types.ObjectId): Promise<boolean> {
        return await this.bookingRepository.delete(id);
    } 

    /**
     * Obtiene la cantidad de estudiantes por cada día del mes en el que se programaron o realizaron tutorías con el tutor.
     * Utilizado para alimentar gráficos estadísticos en el dashboard del tutor.
     *
     * @async
     * @param {Types.ObjectId} tutorId - Identificador del tutor.
     * @returns {Promise<{day: number, count: number}[]>} Promesa que resuelve con un array de objetos `{ day, count }`.
     * @throws {Error} Si el tutor no existe en la base de datos o el resultado es indefinido.
     */
    async getStudentsByTutorBooking(tutorId: Types.ObjectId): Promise<{day: number, count: number}[]> {

        const tutorExist = await this.userRepository.findById(tutorId);

        if (!tutorExist){
            throw new Error ("Tutor no found");
        }

        const result = await this.bookingRepository.recuentStudentsForDays({ tutorId });
        //console.log('result1 :>> ', result);

        if (result === undefined) {
            throw new Error("Result es undefined");
        }

        if(result.length == 0) {
            return [];
        }

        return result;
    }

    /**
     * Obtiene las próximas dos reservas programadas para un tutor con base en su estado.
     *
     * @async
     * @param {Types.ObjectId} tutorId - Identificador de MongoDB del tutor.
     * @param {String} status - Estado requerido de las reservas (ej: "Aceptada").
     * @returns {Promise<any[]>} Promesa que resuelve con las dos reservas más próximas ordenadas cronológicamente.
     * @throws {Error} Si el tutor no existe en la base de datos o si la consulta falla.
     */
    async getNextTwoBookingsForTutor(tutorId: Types.ObjectId, status: String): Promise<any[]> {

        if(!await this.userRepository.findById(tutorId)){
            throw new Error("User not found");
        }

        const result = await this.bookingRepository.nextBooking(tutorId, status);
        //console.log('result :>> ', result);

        if (result === undefined) {
            throw new Error("Result es undefined");
        }

        if(result.length == 0) {
            return [];
        }

        return result;
    }

    /**
     * Revisa y actualiza el estado de las reservas que están en "Pendiente por pago"
     * y cuya fecha límite (`paymentExpiresAt`) ya ha sido superada, marcándolas como "Expirada".
     * Ejecutado de manera recurrente por un trabajo en segundo plano (Cron/Job).
     *
     * @async
     * @returns {Promise<void>}
     */
    async expirePendingPayments(): Promise<void> {
    const now = new Date();
    
    await this.bookingRepository.updateMany(
        {
            status: "Pendiente por pago",
            paymentExpiresAt: { $lte: now }
        },
        {
            status: "Expirada"
        }
    );
  }
}