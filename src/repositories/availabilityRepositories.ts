/**
 * @fileoverview Repositorio de Disponibilidades (Availability Repository)
 * @module repositories/availabilityRepositories
 * @description Capa de acceso a datos para la colección de disponibilidades de tutores en MongoDB usando Mongoose.
 */

import { AvailabilityModel } from "../models/availabilityModels";
import { Query } from "../types/reporsitoryTypes";
import { IAvailabilityRepository, Availability } from "../types/availabilityTypes";
import { Types } from "mongoose";

/**
 * Repositorio que gestiona las operaciones de persistencia para las disponibilidades de los tutores.
 * Implementa el patrón Repository mediante `IAvailabilityRepository`.
 *
 * @class AvailabilityRepository
 * @implements {IAvailabilityRepository}
 */
export class AvailabilityRepository implements IAvailabilityRepository{

    /**
     * Persiste una nueva franja de disponibilidad en la base de datos.
     *
     * @async
     * @param {Availability} data - Documento con los datos de disponibilidad a guardar.
     * @returns {Promise<Availability>} Promesa que resuelve con la disponibilidad guardada.
     */
    async create(data: Availability): Promise<Availability> {
        const newAvailability = new AvailabilityModel(data);
        return await newAvailability.save();
    }

    /**
     * Consulta todas las disponibilidades que coincidan con los criterios de búsqueda.
     *
     * @async
     * @param {Query} [query] - Filtro de búsqueda para la consulta en MongoDB.
     * @returns {Promise<Availability[]>} Promesa que resuelve con un array de disponibilidades encontradas.
     */
    async findAll(query?: Query): Promise<Availability[]> {
        return await AvailabilityModel.find(query || {}).exec();
    }   

    /**
     * Busca una franja de disponibilidad por su identificador único (ObjectId).
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad.
     * @returns {Promise<Availability | null>} Promesa que resuelve con el documento encontrado o null si no existe.
     */
    async findById(id: Types.ObjectId): Promise<Availability | null> {
        return await AvailabilityModel.findById(id).exec();
    }

    /**
     * Actualiza una disponibilidad por su ID retornando el documento actualizado.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad.
     * @param {Partial<Availability>} data - Campos parciales a actualizar.
     * @returns {Promise<Availability | null>} Promesa que resuelve con la disponibilidad actualizada o null si no se encontró.
     */
    async update(id: Types.ObjectId, data: Partial<Availability>): Promise<Availability | null> {
        return await AvailabilityModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina una franja de disponibilidad por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la disponibilidad a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó el documento, o false en caso contrario.
     */
    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await AvailabilityModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca el primer registro de disponibilidad que coincida con los criterios dados.
     *
     * @async
     * @param {Query} query - Filtro de búsqueda en MongoDB.
     * @returns {Promise<Availability | null>} Promesa que resuelve con el documento coincidente o null.
     */
    async findOne (query: Query): Promise<Availability | null> {
        return await AvailabilityModel.findOne(query).exec();
    }

}