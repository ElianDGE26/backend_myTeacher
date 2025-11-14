import { Types } from "mongoose";
import { Query } from "../types/reporsitoryTypes";
import { IUserRepository, IUserService, User } from "../types/usersTypes";


export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser (user: User): Promise<User> {
        return this.userRepository.create(user);
    }

    async findAllUsers (query?: Query): Promise<User[]> {
        return this.userRepository.findAll(query);
    }

    async findUserById (id: Types.ObjectId): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async findUserByEmail (email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    async updateUserById (id: Types.ObjectId, user: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, user);
    }   

    async deleteUserById (id: Types.ObjectId): Promise<boolean> {
        return this.userRepository.delete(id);
    }

}