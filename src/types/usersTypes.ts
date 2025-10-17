import { Repository } from "./reporsitoryTypes";

export interface User {
    id: string;
    name: string;
    balance: number;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
    validatedTeacher: boolean;
    phone?: string;
    location: {
        city: string;
        country: string;
    };
    subjects?: {
        name: string;
        educationLevel: string;
        description: string;
    }[];
    availability?: {
        day: string;
        starTime: string;
        endTime: string;
    }[];
    reputation: {
        rating: number;
        rewiewsCount: number;
    };
}

export interface IUserRepository extends Repository<User> {}

export interface IUserService {
    createUser(user: User): Promise<User>;
    findAllUsers(): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    updateUserById(id: string, user: Partial<User>): Promise<User | null>;
    deleteUserById(id: string): Promise<boolean>;
}