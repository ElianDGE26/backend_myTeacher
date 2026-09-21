/**
 * @fileoverview Repositorio de PQRs (PQR Repository)
 * @module repositories/pqrRepositories
 * @description Capa de acceso a datos para la colección de peticiones, quejas y reclamos (PQRs) en MongoDB usando Mongoose.
 */

import { PqrModel } from "../models/pqrModels";
import { Query } from "../types/reporsitoryTypes";
import { IPqrRepository, Pqr } from "../types/pqrTypes";
import { Types } from "mongoose";

/**
 * Repositorio que gestiona las operaciones de persistencia para solicitudes de soporte y PQRs.
 * Implementa `IPqrRepository`.
 *
 * @class PqrRepository
 * @implements {IPqrRepository}
 */
export class PqrRepository implements IPqrRepository{

    /**
     * Persiste una nueva PQR en la base de datos.
     *
     * @async
     * @param {Pqr} data - Objeto con los datos de la PQR a registrar.
     * @returns {Promise<Pqr>} Promesa que resuelve con la PQR guardada.
     */
    async create(data: Pqr): Promise<Pqr> {
        const newPqr = new PqrModel(data);
        return await newPqr.save();
    }

    /**
     * Consulta todas las PQRs que coincidan con los criterios de búsqueda opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado de búsqueda.
     * @returns {Promise<Pqr[]>} Promesa que resuelve con un array de PQRs encontradas.
     */
    async findAll(query?: Query): Promise<Pqr[]> {
        return await PqrModel.find(query || {}).exec();
    }   

    /**
     * Busca una PQR específica por su ID de MongoDB.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de la PQR.
     * @returns {Promise<Pqr | null>} Promesa que resuelve con el documento encontrado o null.
     */
    async findById(id: Types.ObjectId): Promise<Pqr | null> {
        return await PqrModel.findById(id).exec();
    }

    /**
     * Actualiza una PQR existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la PQR.
     * @param {Partial<Pqr>} data - Campos parciales modificados.
     * @returns {Promise<Pqr | null>} Promesa que resuelve con la PQR actualizada o null.
     */
    async update(id: Types.ObjectId, data: Partial<Pqr>): Promise<Pqr | null> {
        return await PqrModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina una PQR de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la PQR a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó, o false en caso contrario.
     */
    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await PqrModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca la primera PQR que coincida con los criterios de consulta dados.
     *
     * @async
     * @param {Query} query - Criterios de búsqueda en MongoDB.
     * @returns {Promise<Pqr | null>} Promesa que resuelve con la PQR encontrada o null.
     */
    async findOne (query: Query): Promise<Pqr | null> {
        return await PqrModel.findOne(query).exec();
    }

}