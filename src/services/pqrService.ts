/**
 * @fileoverview Servicio de PQRs (PQR Service)
 * @module services/pqrService
 * @description Capa de lógica de negocio para la administración de solicitudes, reclamos, peticiones y quejas ciudadanas/usuarios.
 */

import { Types } from "mongoose";
import { IPqrRepository, IPqrService, Pqr } from "../types/pqrTypes";
import { Query } from "../types/reporsitoryTypes";

/**
 * Servicio encargado de gestionar las peticiones, quejas y reclamos (PQRs).
 * Implementa la interfaz `IPqrService`.
 *
 * @class PqrService
 * @implements {IPqrService}
 */
export class PqrService implements IPqrService {
    private pqrRepository: IPqrRepository;

    /**
     * Inicializa una nueva instancia de PqrService inyectando su repositorio.
     *
     * @constructor
     * @param {IPqrRepository} pqrRepository - Repositorio para la persistencia de PQRs.
     */
    constructor(pqrRepository: IPqrRepository) {
        this.pqrRepository = pqrRepository;
    }

    /**
     * Crea y registra una nueva PQR en el sistema.
     *
     * @async
     * @param {Pqr} pqr - Objeto con los datos de la PQR (userId, type, description, status, etc.).
     * @returns {Promise<Pqr>} Promesa que resuelve con la PQR registrada.
     */
    async createPqr (pqr: Pqr): Promise<Pqr> {
        return this.pqrRepository.create(pqr);
    }

    /**
     * Consulta todas las PQRs aplicando filtros de búsqueda opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado opcionales (ej: userId, status, type).
     * @returns {Promise<Pqr[]>} Promesa que resuelve con la lista de PQRs encontradas.
     */
    async findAllPqrs (query?: Query): Promise<Pqr[]> {
        return this.pqrRepository.findAll(query);
    }

    /**
     * Busca una PQR específica por su identificador único.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la PQR.
     * @returns {Promise<Pqr | null>} Promesa que resuelve con la PQR encontrada o null si no existe.
     */
    async findPqrById (id: Types.ObjectId): Promise<Pqr | null> {
        return this.pqrRepository.findById(id);
    }

    /**
     * Actualiza la información o estado de una PQR por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la PQR.
     * @param {Partial<Pqr>} pqr - Campos modificados de la PQR.
     * @returns {Promise<Pqr | null>} Promesa que resuelve con la PQR actualizada o null si no fue encontrada.
     */
    async updatePqrById (id: Types.ObjectId, pqr: Partial<Pqr>): Promise<Pqr | null> {
        return this.pqrRepository.update(id, pqr);
    }   

    /**
     * Elimina una PQR de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB de la PQR a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminada con éxito, o false en caso contrario.
     */
    async deletePqrById (id: Types.ObjectId): Promise<boolean> {
        return this.pqrRepository.delete(id);
    }  
}