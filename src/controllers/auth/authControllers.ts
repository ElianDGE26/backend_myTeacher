/**
 * @fileoverview Controlador de Autenticación y Sesiones (Auth Controller)
 * @module controllers/auth/authControllers
 * @description Maneja el registro de nuevos usuarios, inicio de sesión, cambio de contraseña, cierre de sesión y rotación / refresco de tokens JWT con persistencia de sesiones.
 */

import { IUserRepository, IUserService, User } from "../../types/usersTypes";
import { UserRepository } from "../../repositories/userRepositories";
import { UserService } from "../../services/userService";
import { Request, Response } from "express";
import config from '../../config/config';
import { TokenService } from "../../services/sessionsService";
import { ISessionService, Session } from "../../types/sessionTypes";
import { SessionRepository } from "../../repositories/sessionRepository"
import { SessionService } from "../../services/sessionsService";
import { ref } from "process";
import mongoose, { Types } from "mongoose";

// Clave secreta para firmar los tokens JWT
const SECRET_KEY = config.jwtSecret;

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const sessionRepository = new SessionRepository();
const sessionService: ISessionService = new SessionService(sessionRepository);

/**
 * Registra un nuevo usuario en la plataforma, genera tokens de autenticación JWT y crea la sesión inicial.
 *
 * @route POST /api/users/auth/register
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {User} req.body - Datos del usuario a registrar (email, password, role, etc.).
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 201 - Usuario registrado exitosamente junto con el token JWT: `{ message, user, token }`.
 * @returns {Promise<Response>} 400 - Email no proporcionado.
 * @returns {Promise<Response>} 409 - Ya existe un usuario registrado con ese email.
 * @returns {Promise<Response>} 500 - Error interno del servidor al procesar el registro.
 */
export const registerUSer = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;

        if (!email) { // Validar que el email esté presente
            return res.status(400).json({ 
                message: "Email is required" 
            });
        }

        const userEXists = await userService.findUserByEmail(email)

        if (userEXists) { // Verificar si el usuario ya existe
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const newUser: User = req.body;

        const result = await userService.createUser(newUser);

        // token JWT
        const { token, refreshToken } = TokenService.generateAccessToken({
            idUser: result._id,
            email: result.email, 
            role: result.role
        }); 

        await sessionService.createSession({
            userId : result._id,
            accessToken: token,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
        } as Session);


         res.status(201).json({
            message: "User registered successfully",
            user: result,
            token: token
        })
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Autentica las credenciales de un usuario (email y contraseña), elimina sesiones previas
 * y genera un nuevo par de Access Token y Refresh Token con sesión persistida.
 *
 * @route POST /api/users/auth/login
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Object} req.body - Credenciales del usuario.
 * @param {string} req.body.email - Correo electrónico registrado.
 * @param {string} req.body.password - Contraseña en texto plano.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Login exitoso: `{ message, token, refreshToken }`.
 * @returns {Promise<Response>} 400 - Email o contraseña ausentes.
 * @returns {Promise<Response>} 401 - Credenciales inválidas (usuario no encontrado o contraseña incorrecta).
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const loginUser = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordValide = await user.comparePassword(password);

        if (!passwordValide) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ Eliminar sesiones anteriores del usuario
        await sessionService.deleteSessionByUserId(user._id as Types.ObjectId);

        // token JWT
        const { token, refreshToken } = TokenService.generateAccessToken({
            idUser: user._id,
            email: user.email, 
            role: user.role
        }); 

        await sessionService.createSession({
            userId : user._id,
            accessToken: token,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
        } as Session);


        res.status(200).json({ 
            message: "Login successful", 
            token: token,
            refreshToken: refreshToken
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
}

/**
 * Permite a un usuario cambiar su contraseña actual verificando previamente su identidad.
 *
 * @route PUT /api/users/auth/change-password
 * @access Público / Autenticado
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Object} req.body - Datos para el cambio de contraseña.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.password - Contraseña actual.
 * @param {string} req.body.newPassword - Nueva contraseña a establecer.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Contraseña actualizada exitosamente.
 * @returns {Promise<Response>} 400 - Faltan campos requeridos (password, newPassword o email).
 * @returns {Promise<Response>} 401 - La contraseña actual proporcionada es incorrecta.
 * @returns {Promise<Response>} 404 - Usuario no encontrado con ese email.
 * @returns {Promise<Response>} 500 - Error interno del servidor o al guardar la nueva contraseña.
 */
export const changePassword = async (req:Request, res: Response) => {

    try {
        const { password, newPassword, email } = req.body; 

        if(!password || !newPassword || !email) {
            return res.status(400).json({ message: "Password, new password and userId are required"});
        }

        const user = await userService.findUserByEmail(email);
        
        //el usuario no existe en la bdd
        if(!user){
            return res.status(404).json({ message: "User not found"});
        }

        //comparamos password
        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Inavlid current pasword"});
        }

        //actaulizamos la contraseña en la bdd
        const updatePassword = await userService.updateUserById(new mongoose.Types.ObjectId(user._id as string), { password: newPassword});

        if(!updatePassword){
            return res.status(500).json({ message: "Error updating password"});
        }

        res.status(200).json({ message: "Password updated successfull"});
        
    } catch (error) {
        console.error("Error changing password: ", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

/**
 * Cierra la sesión activa del usuario eliminando el registro de la sesión a través del Refresh Token.
 *
 * @route POST /api/users/auth/logout
 * @access Público / Autenticado
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.refreshToken - Refresh token de la sesión activa a revocar.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Sesión cerrada exitosamente.
 * @returns {Promise<Response>} 400 - Refresh token ausente en la petición.
 * @returns {Promise<Response>} 500 - Error al eliminar la sesión o error interno del servidor.
 */
export const logoutUser = async (req:Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if(!refreshToken){
            return res.status(400).json({ message: "Refresh token is required"});
        }

        const deleted = await sessionService.deleteSessionByRefreshToken(refreshToken);

        if(!deleted){
            return res.status(500).json({ message: "Error logging out user"});
        }

        res.status(200).json({ message: "User logged out successfuly"});
        
    } catch (error) {
        console.error("Error logging out user: ", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

/**
 * Renueva el par de Access Token y Refresh Token utilizando un Refresh Token válido y no expirado.
 *
 * Flujo:
 * 1. Valida la presencia del refreshToken en el cuerpo de la solicitud.
 * 2. Consulta la sesión en la base de datos y verifica su fecha de expiración.
 * 3. Valida la firma criptográfica del JWT del Refresh Token.
 * 4. Genera nuevos Access Token y Refresh Token, actualiza la sesión en BD y los retorna al cliente.
 *
 * @route POST /api/users/auth/refresh-token
 * @access Público
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.refreshToken - Refresh token actual.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} 200 - Nuevos tokens generados: `{ accessToken, refreshToken }`.
 * @returns {Promise<Response>} 400 - Refresh token ausente.
 * @returns {Promise<Response>} 401 - Refresh token expirado, inválido o no encontrado en la base de datos.
 * @returns {Promise<Response>} 500 - Error interno del servidor.
 */
export const refreshToken = async (req: Request, res:Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) { // sino existe en el request
            return res.status(400).json({ message: "Refresh token is required"});
        }

        const session = await sessionService.findSessionByRefreshToken(refreshToken); //se busca en ls bdd
        
        //verificamos sino existe la session en bdd
        if (!session) {
            return res.status(401).json({ message: "Inavlid or expired refresh token"})
        }

        //verificamos si el token ha expirado
        if (session.expiresAt.getTime() < Date.now()){ //valida token expirado 
            await sessionService.deleteSessionById(new mongoose.Types.ObjectId(session._id as string));
            return res.status(401).json({ message: "Refresh token has expired"});
        }

        let payload: any;
        
        try { //se verifica la firma del token
            payload = TokenService.verifyRefreshToken(refreshToken);
        } catch (error) {
            await sessionService.deleteSessionById(new mongoose.Types.ObjectId(session._id as string));
            return res.status(401).json({ message: "Invalid refresh token"});
        }

        //Generamos el nuevo token
        const { token: newAccessToken, refreshToken: newRefreshToken } = TokenService.generateAccessToken({
            idUser: payload.idUser,
            email: payload.email,
            role: payload.role,
        });

        //actualizamos la session en la bdd
        await sessionService.updateSessionByid(new mongoose.Types.ObjectId(session._id as string), {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });


        //Devolvemos el nuevo token al cliente
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error("Error refreshing token");
        res.status(500).json({ message: "Internal server error"});
    }
}