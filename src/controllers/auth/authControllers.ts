import { IUserRepository, IUserService, User } from "../../types/usersTypes";
import { UserRepository } from "../../repositories/userRepositories";
import { UserService } from "../../services/userService";
import { Request, Response } from "express";
import jsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Clave secreta para firmar los tokens JWT
const SECRET_KEY = process.env.SECRET_KEY || "ClaveSecreta";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);



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

         res.status(201).json({
            message: "User registered successfully",
            user: result
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

        // token JWT
        const token = jsonWebToken.sign({
            id: user._id, 
            email: user.email, 
            role: user.role
        },SECRET_KEY,
        { expiresIn: "1h" });

        res.status(200).json({ 
            message: "Login successful", 
            token: token 
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
}