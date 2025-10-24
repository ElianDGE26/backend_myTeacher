import { NextFunction, Request, Response } from "express";
import { IUserRepository, IUserService, User } from "../types/usersTypes";
import { UserRepository } from "../repositories/userRepositories";
import jwt from 'jsonwebtoken'
import config from "../config/config";
import { UserService } from "../services/userService";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);


const jwtSecret: string = config.jwtSecret;

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.replace(/^Bearer\s+/, "") as string; 

    try {    
        const verify = jwt.verify(token, jwtSecret) as User;

        const getUser = await userService.findUserByEmail(verify.email);

        if (!getUser) {
            return res.status(400);   
        }

        req.currentUser = getUser;

        console.log('verify :>> ', verify);
        next();
    } catch (error: any) {
        console.log('Error verificandfo Tokens :>> ', error);
        res.status(401).send(error.message);
    }
}