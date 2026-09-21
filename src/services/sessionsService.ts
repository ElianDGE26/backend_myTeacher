/**
 * @fileoverview Servicio de Sesiones y Tokens JWT (Sessions and Token Service)
 * @module services/sessionsService
 * @description Capa de lógica de negocio para la gestión del ciclo de vida de sesiones persistidas en base de datos, así como la generación y verificación criptográfica de Access Tokens y Refresh Tokens JWT.
 */

import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { ISessionRepository, ISessionService, Session } from "../types/sessionTypes";
import { SessionRepository } from "../repositories/sessionRepository";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../types/usersTypes";

const ACCESS_SECRET: string = config.jwtSecret;
const ACCESS_SECRET_REFRESH_TOKEN: string = config.jwtSecretRefreshToken;

/**
 * Servicio encargado de gestionar las sesiones activas de los usuarios en la base de datos.
 * Implementa la interfaz `ISessionService`.
 *
 * @class SessionService
 * @implements {ISessionService}
 */
export class SessionService implements ISessionService {
    private sessionRepository: ISessionRepository;

    /**
     * Inicializa una nueva instancia de SessionService inyectando su repositorio.
     *
     * @constructor
     * @param {ISessionRepository} sessionRepository - Repositorio para la persistencia de sesiones.
     */
    constructor(sessionRepository: ISessionRepository){
        this.sessionRepository = sessionRepository;
    }

    /**
     * Busca una sesión por su identificador único de MongoDB.
     *
     * @param {Types.ObjectId} id - Identificador de la sesión.
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión encontrada o null.
     */
    findSessionById(id: Types.ObjectId): Promise<Session | null> {
        return this.sessionRepository.findById(id);
    }

    /**
     * Actualiza los datos de una sesión por su ID (por ejemplo, al rotar tokens o renovar expiración).
     *
     * @param {Types.ObjectId} id - Identificador de MongoDB de la sesión.
     * @param {Partial<Session>} session - Campos actualizados de la sesión.
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión actualizada o null.
     */
    updateSessionByid(id: Types.ObjectId, session: Partial<Session>): Promise<Session | null> {
        return this.sessionRepository.update(id, session);
    }

    /**
     * Consulta todas las sesiones activas según filtros opcionales.
     *
     * @param {Query} [query] - Criterios de búsqueda opcionales.
     * @returns {Promise<Session[]>} Promesa que resuelve con un array de sesiones.
     */
    findAllSessions(query?: Query): Promise<Session[]> {
        return this.sessionRepository.findAll(query);
    }

    /**
     * Elimina una sesión específica por su ID.
     *
     * @param {Types.ObjectId} id - Identificador de la sesión a revocar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada, o false en caso contrario.
     */
    deleteSessionById(id: Types.ObjectId): Promise<boolean> {
        return this.sessionRepository.delete(id);
    }

    /**
     * Registra y persiste una nueva sesión de usuario en la base de datos.
     *
     * @param {Session} session - Objeto con los datos de la sesión (userId, accessToken, refreshToken, expiresAt).
     * @returns {Promise<Session>} Promesa que resuelve con la sesión persistida.
     */
    createSession(session: Session): Promise<Session> {
        return this.sessionRepository.create(session);
    }

    /**
     * Busca una sesión activa asociada a un Refresh Token específico.
     *
     * @param {string} refreshToken - Token de refresco a consultar.
     * @returns {Promise<Session | null>} Promesa que resuelve con la sesión o null si no se encontró.
     */
    findSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
        return this.sessionRepository.findOne({ refreshToken})
    }

    /**
     * Elimina una sesión activa asociada a un Refresh Token (utilizado en el logout).
     *
     * @param {string} refreshToken - Token de refresco cuya sesión se va a revocar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada exitosamente.
     */
    deleteSessionByRefreshToken(refreshToken: string): Promise<boolean> {
        return this.sessionRepository.deleteByRefreshToken({ refreshToken} );
    }

    /**
     * Elimina todas las sesiones activas vinculadas a un usuario específico (por ejemplo, al iniciar sesión nuevamente).
     *
     * @param {Types.ObjectId} userId - Identificador de MongoDB del usuario.
     * @returns {Promise<boolean>} Promesa que resuelve con true si las sesiones fueron eliminadas.
     */
    deleteSessionByUserId(userId: Types.ObjectId): Promise<boolean> {
        return this.sessionRepository.deleteByUserId(userId);
    }

    
}

/**
 * Servicio utilitario estático para la generación y validación de JSON Web Tokens (JWT).
 *
 * @class TokenService
 */
export class TokenService {
    /**
     * Genera un par de tokens JWT:
     * - Access Token: Tiempo de expiración corto (1 hora).
     * - Refresh Token: Tiempo de expiración extendido (3 días).
     *
     * @static
     * @param {Object} payload - Carga útil a codificar en los tokens (idUser, email, role, etc.).
     * @returns {{ token: string, refreshToken: string }} Objeto conteniendo el token de acceso y el token de refresco.
     */
    static generateAccessToken(payload: Object): any {
        const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h"} );
        const refreshToken = jwt.sign(payload, ACCESS_SECRET_REFRESH_TOKEN, { expiresIn: "3d"} );
        return { token, refreshToken };
    }

    /**
     * Verifica criptográficamente y decodifica un Access Token JWT.
     *
     * @static
     * @param {string} token - Access token en formato Bearer JWT.
     * @returns {User} Carga útil decodificada con la identidad del usuario.
     * @throws {JsonWebTokenError | TokenExpiredError} Si el token es inválido o ha expirado.
     */
    static verifyAccessToken(token: string) {
        return jwt.verify(token, ACCESS_SECRET) as User;
    }

    /**
     * Verifica criptográficamente y decodifica un Refresh Token JWT.
     *
     * @static
     * @param {string} token - Refresh token JWT.
     * @returns {User} Carga útil decodificada con la identidad del usuario.
     * @throws {JsonWebTokenError | TokenExpiredError} Si el token es inválido o ha expirado.
     */
    static verifyRefreshToken(token: string) {
        return jwt.verify(token, ACCESS_SECRET_REFRESH_TOKEN) as User;
    }
}




