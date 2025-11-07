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
import { Types } from "mongoose";

// Clave secreta para firmar los tokens JWT
const SECRET_KEY = config.jwtSecret;

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const sessionRepository = new SessionRepository();
const sessionService: ISessionService = new SessionService(sessionRepository);



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

export const changePassword = async (req:Request, res: Response) => {

    try {
        const { password, newPassword, email } = req.body; 

        if(!password || !newPassword || !email) {
            return res.status(400).json({ message: "Password, new password and userId are required"});
        }

        const user = await userService.findUserByEmail(email);

        if(!user){
            return res.status(404).json({ message: "User not found"});
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Inavlid current pasword"});
        }

        const updatePassword = await userService.updateUserById(user._id as string, { password: newPassword});

        if(!updatePassword){
            return res.status(500).json({ message: "Error updating password"});
        }

        res.status(200).json({ message: "Password updated successfull"});
        
    } catch (error) {
        console.error("Error changing password: ", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

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

export const refreshToken = async (req: Request, res:Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) { // sino existe en el request
            return res.status(400).json({ message: "Refresh token is required"});
        }

        const session = await sessionService.findSessionByRefreshToken(refreshToken);
        
        //verificamos sino existe la session en bdd
        if (!session) {
            return res.status(401).json({ message: "Inavlid or expired refresh token"})
        }

        //verificamos si el token ha expirado
        if (session.expiresAt.getTime() < Date.now()){ //valida token expirado 
            await sessionService.deleteSessionById(session._id as string);
            return res.status(401).json({ message: "Refresh token has expired"});
        }

        let payload: any;
        
        try { //se verifica la firma del token
            payload = TokenService.verifyRefreshToken(refreshToken);
        } catch (error) {
            await sessionService.deleteSessionById(session._id as string);
            return res.status(401).json({ message: "Invalid refresh token"});
        }

        //Generamos el nuevo token
        const { token: newAccessToken, refreshToken: newRefreshToken } = TokenService.generateAccessToken({
            idUser: payload.idUser,
            email: payload.email,
            role: payload.role,
        });

        //actualizamos la session en la bdd
        await sessionService.updateSessionByid(session._id as string, {
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