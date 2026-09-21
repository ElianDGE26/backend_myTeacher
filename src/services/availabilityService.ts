/**
 * @fileoverview Servicio de Disponibilidad (Availability Service)
 * @module services/availabilityService
 * @description Capa de lógica de negocio para la gestión de franjas horarias y disponibilidad semanal de los tutores.
 */

import { Types } from "mongoose";
import { IAvailabilityRepository, IAvailabilityService, Availability } from "../types/availabilityTypes";
import { Query } from "../types/reporsitoryTypes";

/**
 * Servicio encargado de la gestión de las disponibilidades de los tutores.
 * Implementa la interfaz `IAvailabilityService`.
 *
 * @class AvailabilityService
 * @implements {IAvailabilityService}
 */
export class AvailabilityService implements IAvailabilityService {
    private availabilityRepository: IAvailabilityRepository;

    /**
     * Inicializa una nueva instancia de AvailabilityService inyectando su repositorio.
     *
     * @constructor
     * @param {IAvailabilityRepository} AvailabilityRepository - Repositorio para operaciones de persistencia de disponibilidad.
     */
    constructor(AvailabilityRepository: IAvailabilityRepository) {
        this.availabilityRepository = AvailabilityRepository;
    }

    /**
     * Registra una nueva franja de disponibilidad para un tutor.
     *
     * @async
     * @param {Availability} availability - Objeto con los datos de disponibilidad (tutorId, día, rango de horas, estado activo).
     * @returns {Promise<Availability>} Promesa que resuelve con la disponibilidad creada en la base de datos.
     */
    async createAvailability (availability: Availability): Promise<Availability> {
        return this.availabilityRepository.create(availability);
    }

    /**
     * Obtiene una lista de disponibilidades aplicando filtros opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda y filtrado opcionales (por ejemplo: tutorId, dayOfWeek, active).
     * @returns {Promise<Availability[]>} Promesa que resuelve con un array de disponibilidades encontradas.
     */
    async findAllAvailabilities (query?: Query): Promise<Availability[]> {
        return this.availabilityRepository.findAll(query);
    }

    /**
     * Busca una disponibilidad específica mediante su identificador único.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad.
     * @returns {Promise<Availability | null>} Promesa que resuelve con la disponibilidad encontrada o null si no existe.
     */
    async findAvailabilityById (id: Types.ObjectId): Promise<Availability | null> {
        return this.availabilityRepository.findById(id);
    }

    /**
     * Actualiza parcialmente una franja de disponibilidad existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad a actualizar.
     * @param {Partial<Availability>} availability - Objeto con los campos modificados.
     * @returns {Promise<Availability | null>} Promesa que resuelve con el documento actualizado o null si no se encontró.
     */
    async updateAvailabilityById (id: Types.ObjectId, availability: Partial<Availability>): Promise<Availability | null> {
        return this.availabilityRepository.update(id, availability);
    }   

    /**
     * Elimina una franja de disponibilidad de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada exitosamente, o false en caso contrario.
     */
    async deleteAvailabilityById (id: Types.ObjectId): Promise<boolean> {
        return this.availabilityRepository.delete(id);
    }  
}