import { IUserRepository, IUserService } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import { UserService } from "../services/userService";
import { User} from "../types/usersTypes";
import { Request, Response } from "express";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);



export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const result =  await userService.findAllUsers();

        if (result.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing user ID in params" });
        }
        
        const result =  await userService.findUserById(id);

        if (!result) {
            return res.status(404).json({ message: "No user found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


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


export const updateUserByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const userUpdate: User = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing user ID in params" });
        }

        const result =  await userService.updateUserById(id, userUpdate);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUserByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing user ID in params" });
        }

        const result =  await userService.deleteUserById(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
