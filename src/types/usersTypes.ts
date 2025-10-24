import { Document, Types } from "mongoose";
import { Repository, Query} from "./reporsitoryTypes";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
    validatedTeacher: boolean;
    phone?: string;
    balance: number;
    location: {
        city: string;
        country: string;
    };
    reputation: {
        rating: number;
        rewiewsCount: number;
    };
    comparePassword(password: string): Promise<boolean>;
}

export interface IUserRepository extends Repository<User> {
    findOne(query: Query): Promise<User | null>;
}

export interface IUserService {
    createUser(user: User): Promise<User>;
    findAllUsers(query?: Query): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUserById(id: string, user: Partial<User>): Promise<User | null>;
    deleteUserById(id: string): Promise<boolean>;
}