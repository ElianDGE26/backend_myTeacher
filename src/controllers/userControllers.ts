/**
 * @fileoverview Controlador de Usuarios (User Controller)
 * @module controllers/userControllers
 * @description Maneja las operaciones CRUD de los usuarios del sistema (estudiantes, tutores y administradores).
 */

import { IUserRepository, IUserService } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import { UserService } from "../services/userService";
import { User} from "../types/usersTypes";
import { Request, Response } from "express";
import mongoose from "mongoose";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

/**
 * Obtiene la lista completa de todos los usuarios registrados.
 *
 * @route GET /api/users
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Array con todos los usuarios registrados.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const result =  await userService.findAllUsers();

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Obtiene la información de un usuario específico mediante su ID.
 *
 * @route GET /api/users/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) del usuario.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos del usuario.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o usuario no encontrado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const getUserByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing user ID in params" });
        }

        //se valida que el id si sea de tipo Object ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Booking Id" });
      }
        
        const result =  await userService.findUserById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "No user found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Crea y registra directamente un nuevo usuario en la base de datos.
 *
 * @route POST /api/users/create
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {User} req.body - Datos del usuario a crear (name, email, password, role, etc.).
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Usuario creado exitosamente.
 * @returns {Promise<Response>} 400 - Datos inválidos o error al registrar.
 */
export const createUser = async (req: Request, res: Response) => {
    try {

        const newUser: User = req.body;

        const result =  await userService.createUser(newUser);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

/**
 * Actualiza la información del perfil de un usuario existente por su ID.
 *
 * @route PUT /api/users/update/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) del usuario.
 * @param {User} req.body - Campos actualizados del usuario.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto con los datos del usuario actualizados.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Usuario no encontrado o formato de ID inválido.
 * @returns {Promise<Response>} 500 - Error al actualizar el usuario en la base de datos.
 */
export const updateUserByid = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userUpdate: User = req.body;

      if (!id) {
        return res.status(400).json({ message: "Missing user ID in params" });
      }

      const userExist = await userService.findUserById(new mongoose.Types.ObjectId(id));

      if (!userExist) {
        return res.status(404).json({ message: "User not found" });
      }

      //se valida que el id si sea de tipo Object ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Booking Id" });
      }

      const result = await userService.updateUserById(new mongoose.Types.ObjectId(id), userUpdate);

      if (!result) {
        return res.status(500).json({ message: "error updating user" });
      }

      res.json(result);
      
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Elimina un usuario del sistema por su ID.
 *
 * @route DELETE /api/users/delete/:id
 * @access Privado (Requiere token de autenticación)
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {string} req.params.id - Identificador único (ObjectId) del usuario a eliminar.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Objeto de confirmación `{ success: boolean }`.
 * @returns {Promise<Response>} 400 - Parámetro ID ausente.
 * @returns {Promise<Response>} 404 - Formato de ID inválido o usuario no encontrado.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const deleteUserByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing user ID in params" });
        }

        //se valida que el id si sea de tipo Object ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Booking Id" });
      }

        const result =  await userService.deleteUserById(new mongoose.Types.ObjectId(id));

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

