import { IUserRepository, IUserService, User } from "../../types/usersTypes";
import { UserRepository } from "../../repositories/userRepositories";
import { UserService } from "../../services/userService";
import { Request, Response } from "express";

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