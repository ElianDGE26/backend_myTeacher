import { IUserRepository, IUserService, User } from "../types/usersTypes";


export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser (user: User): Promise<User> {
        return this.userRepository.create(user);
    }

    async findAllUsers (): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findUserById (id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    } 

    async updateUserById (id: string, user: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, user);
    }   

    async deleteUserById (id: string): Promise<boolean> {
        return this.userRepository.delete(id);
    }  
}