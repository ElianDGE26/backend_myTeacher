/**
 * @fileoverview Repositorio de Sesiones (Session Repository)
 * @module repositories/sessionRepository
 * @description Capa de acceso a datos para la colección de sesiones activas de usuarios en MongoDB usando Mongoose.
 */

import { Query } from "../types/reporsitoryTypes";
import { ISessionRepository, ISessionService, Session } from "../types/sessionTypes";
import { SessionModel } from "../models/sessionModels"
import { Types } from "mongoose";

/**
 * Repositorio que gestiona la persistencia, consulta y revocación de sesiones de usuarios en MongoDB.
 * Implementa `ISessionRepository`.
 *
 * @class SessionRepository
 * @implements {ISessionRepository}
 */
export class SessionRepository implements ISessionRepository {

    /**
     * Busca la primera sesión que coincida con los criterios dados.
     *
     * @async
     * @param {Query} query - Filtro de consulta (ej: `{ refreshToken: string }`).
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión encontrada o null.
     */
    async findOne(query: Query): Promise<Session | null> {
        return await SessionModel.findOne(query).exec();
    }

    /**
     * Persiste una nueva sesión de usuario en la base de datos.
     *
     * @async
     * @param {Session} item - Objeto con los datos de la sesión (userId, accessToken, refreshToken, expiresAt).
     * @returns {Promise<Session>} Promesa que resuelve con la sesión persistida.
     */
    async create(item: Session): Promise<Session> {
        const newSession = new SessionModel(item);
        return await newSession.save();
    }

    /**
     * Consulta todas las sesiones registradas según criterios opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado.
     * @returns {Promise<Session[]>} Promesa que resuelve con el array de sesiones encontradas.
     */
    async findAll(query?: Query): Promise<Session[]> {
        return  await SessionModel.find(query || {}).exec();
    }

    /**
     * Busca una sesión por su identificador único de MongoDB.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de la sesión.
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión o null si no existe.
     */
    async findById(id: Types.ObjectId): Promise<Session | null> {
        return await SessionModel.findById(id).exec();
    }

    /**
     * Actualiza una sesión existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la sesión.
     * @param {Partial<Session>} item - Campos modificados de la sesión.
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión actualizada o null.
     */
    async update(id: Types.ObjectId, item: Partial<Session>): Promise<Session | null> {
        return await SessionModel.findByIdAndUpdate(id, item, { new:true}).exec();
    }

    /**
     * Elimina una sesión de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de la sesión a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó, o false en caso contrario.
     */
    async delete(id: Types.ObjectId): Promise<boolean> {
        const result  =  await SessionModel.findByIdAndDelete(id).exec();
        return result ? true: false;
    }

    /**
     * Elimina una sesión activa asociada a un Refresh Token específico (utilizado durante el logout).
     *
     * @async
     * @param {Query} query - Criterio conteniendo `{ refreshToken: string }`.
     * @returns {Promise<boolean>} Promesa que resuelve con true si al menos una sesión fue eliminada.
     */
    async deleteByRefreshToken(query: Query): Promise<boolean> {
        const result  = await SessionModel.deleteOne(query).exec();
        return result.deletedCount > 0
    }
    
    /**
     * Elimina todas las sesiones activas asociadas a un ID de usuario (por ejemplo, al iniciar sesión desde un nuevo dispositivo).
     *
     * @async
     * @param {Types.ObjectId} userId - Identificador de MongoDB del usuario.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminaron sesiones para ese usuario.
     */
    async deleteByUserId(userId: Types.ObjectId): Promise<boolean> {
        const result  = await SessionModel.deleteMany( { userId }).exec();
        return result.deletedCount > 0
    }
    
}


