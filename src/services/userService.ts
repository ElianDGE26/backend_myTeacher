/**
 * @fileoverview Servicio de Usuarios (User Service)
 * @module services/userService
 * @description Capa de lógica de negocio para la gestión, consulta, actualización y eliminación de cuentas de usuarios (estudiantes, tutores y administradores).
 */

import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { IUserRepository, IUserService, User } from "../types/usersTypes";

/**
 * Servicio encargado de gestionar las operaciones de usuarios y sus perfiles.
 * Implementa la interfaz `IUserService`.
 *
 * @class UserService
 * @implements {IUserService}
 */
export class UserService implements IUserService {
    private userRepository: IUserRepository;

    /**
     * Inicializa una nueva instancia de UserService inyectando el repositorio de usuarios.
     *
     * @constructor
     * @param {IUserRepository} userRepository - Repositorio para la persistencia de usuarios.
     */
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registra un nuevo usuario en la base de datos.
     *
     * @async
     * @param {User} user - Objeto con los datos del usuario a crear (name, email, password, role, etc.).
     * @returns {Promise<User>} Promesa que resuelve con el usuario registrado.
     */
    async createUser (user: User): Promise<User> {
        return this.userRepository.create(user);
    }

    /**
     * Consulta todos los usuarios según filtros opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de búsqueda y filtros (ej: role, active).
     * @returns {Promise<User[]>} Promesa que resuelve con el array de usuarios encontrados.
     */
    async findAllUsers (query?: Query): Promise<User[]> {
        return this.userRepository.findAll(query);
    }

    /**
     * Busca un usuario por su identificador único de MongoDB.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador del usuario.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario o null si no existe.
     */
    async findUserById (id: Types.ObjectId): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    /**
     * Busca un usuario registrado mediante su dirección de correo electrónico.
     *
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario encontrado o null.
     */
    async findUserByEmail (email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    /**
     * Actualiza la información del perfil de un usuario existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del usuario.
     * @param {Partial<User>} user - Datos modificados del usuario.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario actualizado o null si no se encontró.
     */
    async updateUserById (id: Types.ObjectId, user: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, user);
    }   

    /**
     * Elimina un usuario de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del usuario a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si fue eliminado exitosamente, o false en caso contrario.
     */
    async deleteUserById (id: Types.ObjectId): Promise<boolean> {
        return this.userRepository.delete(id);
    }

}