/**
 * @fileoverview Repositorio de Usuarios (User Repository)
 * @module repositories/userRepositories
 * @description Capa de acceso a datos para la colección de usuarios en MongoDB usando Mongoose.
 */

import { Types } from "mongoose";
import { UserModel } from "../models/userModels";
import { Query } from "../types/reporsitoryTypes";
import { IUserRepository, User } from "../types/usersTypes";

/**
 * Repositorio que gestiona las operaciones de persistencia para las cuentas de usuarios (estudiantes, tutores, administradores).
 * Implementa `IUserRepository`.
 *
 * @class UserRepository
 * @implements {IUserRepository}
 */
export class UserRepository implements IUserRepository{

    /**
     * Persiste un nuevo usuario en la base de datos.
     *
     * @async
     * @param {User} data - Datos del usuario a guardar.
     * @returns {Promise<User>} Promesa que resuelve con el usuario registrado.
     */
    async create(data: User): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    }

    /**
     * Consulta todos los usuarios que coincidan con los criterios de búsqueda opcionales.
     *
     * @async
     * @param {Query} [query] - Criterios de filtrado en MongoDB.
     * @returns {Promise<User[]>} Promesa que resuelve con un array de usuarios.
     */
    async findAll(query?: Query): Promise<User[]> {
        return await UserModel.find(query || {}).exec();
    }   

    /**
     * Busca un usuario por su identificador único (ObjectId).
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del usuario.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario encontrado o null si no existe.
     */
    async findById(id: Types.ObjectId): Promise<User | null> {
        return await UserModel.findById(id).exec();
    }

    /**
     * Actualiza la información de un usuario existente por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del usuario.
     * @param {Partial<User>} data - Campos parciales modificados del usuario.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario actualizado o null.
     */
    async update(id: Types.ObjectId, data: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Elimina un usuario de la base de datos por su ID.
     *
     * @async
     * @param {Types.ObjectId} id - Identificador de MongoDB del usuario a eliminar.
     * @returns {Promise<boolean>} Promesa que resuelve con true si se eliminó exitosamente, o false en caso contrario.
     */
    async delete (id: Types.ObjectId): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }

    /**
     * Busca el primer usuario que coincida con los criterios de consulta (por ejemplo, por email).
     *
     * @async
     * @param {Query} query - Criterios de búsqueda en MongoDB.
     * @returns {Promise<User | null>} Promesa que resuelve con el usuario encontrado o null.
     */
    async findOne (query: Query): Promise<User | null> {
        return await UserModel.findOne(query).exec();
    }

}